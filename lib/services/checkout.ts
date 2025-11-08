import {
  Currency,
  Customer,
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  Prisma,
  ReservationStatus,
} from '@prisma/client';

import { RESERVATION_TTL_MINUTES, VAT_RATE } from '@/lib/constants';
import { DomainError, OutOfStockError, VariantUnavailableError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { PrismaTransactionClient, upsertCustomer } from '@/lib/services/customers';
import { CustomerInput } from '@/lib/types/customer';

export type AddressInput = {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
};

export type CheckoutItemInput = {
  variantId: string;
  quantity: number;
};

export type OrderDraft = {
  order: Order;
  payment: Payment;
  customer: Customer;
  totals: {
    subtotal: Prisma.Decimal;
    tax: Prisma.Decimal;
    total: Prisma.Decimal;
  };
  reservations: { id: string; variantId: string; quantity: number; expiresAt: Date }[];
};

const vatRateDecimal = new Prisma.Decimal(VAT_RATE);

const normalizeItems = (items: CheckoutItemInput[]) => {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.variantId, (map.get(item.variantId) ?? 0) + item.quantity);
  }

  return Array.from(map.entries()).map(([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
};

const assertPositiveQuantities = (items: CheckoutItemInput[]) => {
  items.forEach((item) => {
    if (item.quantity <= 0) {
      throw new DomainError(`Invalid quantity for variant ${item.variantId}`);
    }
  });
};

const computeLineTotals = (unitPrice: Prisma.Decimal, quantity: number) => {
  const q = new Prisma.Decimal(quantity);
  const subtotal = unitPrice.mul(q);
  const tax = subtotal.mul(vatRateDecimal).toDecimalPlaces(2);
  const total = subtotal.add(tax).toDecimalPlaces(2);
  return { subtotal, tax, total };
};

export async function createOrderDraft(params: {
  items: CheckoutItemInput[];
  customer: CustomerInput;
  shippingAddress: AddressInput;
  billingAddress?: AddressInput;
  checkoutKey: string;
}): Promise<OrderDraft> {
  const { items, customer, shippingAddress, billingAddress, checkoutKey } = params;

  assertPositiveQuantities(items);
  const normalizedItems = normalizeItems(items);

  if (!normalizedItems.length) {
    throw new DomainError('Cart is empty');
  }

  const expiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000);

  return prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const customerRecord = await upsertCustomer(tx, customer);

    const variantRecords = await tx.variant.findMany({
      where: { id: { in: normalizedItems.map((item) => item.variantId) } },
      include: {
        inventory: true,
      },
    });

    if (variantRecords.length !== normalizedItems.length) {
      const foundIds = new Set(variantRecords.map((variant) => variant.id));
      const missing = normalizedItems.find((item) => !foundIds.has(item.variantId));
      if (missing) {
        throw new VariantUnavailableError(missing.variantId);
      }
    }

    const variantsById = new Map(
      variantRecords.map((variant) => [variant.id, variant]),
    );

    let subtotalAmount = new Prisma.Decimal(0);
    let taxAmount = new Prisma.Decimal(0);
    let totalAmount = new Prisma.Decimal(0);

    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of normalizedItems) {
      const variant = variantsById.get(item.variantId);
      if (!variant || !variant.inventory) {
        throw new VariantUnavailableError(item.variantId);
      }

      const available =
        variant.inventory.qtyOnHand - variant.inventory.qtyReserved - item.quantity;

      if (available < 0) {
        throw new OutOfStockError(item.variantId);
      }

      const { subtotal, tax, total } = computeLineTotals(variant.price, item.quantity);

      subtotalAmount = subtotalAmount.add(subtotal);
      taxAmount = taxAmount.add(tax);
      totalAmount = totalAmount.add(total);

      orderItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.price,
        taxRate: vatRateDecimal,
        lineSubtotal: subtotal,
        lineTax: tax,
        lineTotal: total,
      });
    }

    const order = await tx.order.create({
      data: {
        customerId: customerRecord.id,
        status: OrderStatus.PENDING_PAYMENT,
        currency: Currency.EUR,
        subtotalAmount,
        discountAmount: new Prisma.Decimal(0),
        taxAmount,
        shippingAmount: new Prisma.Decimal(0),
        totalAmount,
        vatRate: vatRateDecimal,
        billingAddressJson: billingAddress ?? shippingAddress,
        shippingAddressJson: shippingAddress,
        items: {
          createMany: { data: orderItemsData },
        },
      },
    });

    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: Currency.EUR,
        status: PaymentStatus.REQUIRES_PAYMENT_METHOD,
      },
    });

    const reservations: { id: string; variantId: string; quantity: number; expiresAt: Date }[] =
      [];

    for (const item of normalizedItems) {
      const variant = variantsById.get(item.variantId);
      if (!variant || !variant.inventory) continue;

      const updated = await tx.inventory.updateMany({
        where: {
          variantId: variant.id,
          qtyReserved: { lte: variant.inventory.qtyOnHand - item.quantity },
        },
        data: {
          qtyReserved: { increment: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new OutOfStockError(item.variantId);
      }

      const reservation = await tx.inventoryReservation.create({
        data: {
          variantId: variant.id,
          customerId: customerRecord.id,
          quantity: item.quantity,
          expiresAt,
          status: ReservationStatus.ACTIVE,
          checkoutKey,
        },
      });

      reservations.push(reservation);
    }

    return {
      order,
      payment,
      customer: customerRecord,
      totals: {
        subtotal: subtotalAmount,
        tax: taxAmount,
        total: totalAmount,
      },
      reservations,
    };
  });
}
