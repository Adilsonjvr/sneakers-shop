import { PaymentStatus, Prisma, ReservationStatus } from '@prisma/client';
import type Stripe from 'stripe';
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getStripeClient } from '@/lib/stripe';
import { AddressInput, CheckoutItemInput, createOrderDraft } from '@/lib/services/checkout';
import { prisma } from '@/lib/prisma';
import {
  DomainError,
  IdempotencyConflictError,
  OutOfStockError,
  VariantUnavailableError,
} from '@/lib/errors';
import { CustomerInput } from '@/lib/types/customer';
import { customerSchema } from '@/lib/validation/customer';

const addressSchema: z.ZodType<AddressInput> = z.object({
  line1: z.string().min(3).max(120),
  line2: z.string().max(120).optional(),
  city: z.string().min(2).max(60),
  region: z.string().min(2).max(60).optional(),
  postalCode: z.string().min(3).max(20),
  country: z.string().length(2),
});

const itemSchema: z.ZodType<CheckoutItemInput> = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().positive().max(5),
});

const payloadSchema = z.object({
  customer: customerSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  items: z.array(itemSchema).min(1),
});

const STRIPE_IDEMPOTENCY_HEADER = 'idempotency-key';

const mapStripeStatus = (status: Stripe.PaymentIntent.Status): PaymentStatus => {
  switch (status) {
    case 'requires_action':
      return PaymentStatus.REQUIRES_ACTION;
    case 'requires_confirmation':
      return PaymentStatus.REQUIRES_CONFIRMATION;
    case 'requires_payment_method':
      return PaymentStatus.REQUIRES_PAYMENT_METHOD;
    case 'processing':
      return PaymentStatus.PROCESSING;
    case 'requires_capture':
      return PaymentStatus.AUTHORIZED;
    case 'canceled':
      return PaymentStatus.CANCELED;
    case 'succeeded':
      return PaymentStatus.SUCCEEDED;
    default:
      return PaymentStatus.REQUIRES_PAYMENT_METHOD;
  }
};

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const idempotencyKey =
    request.headers.get(STRIPE_IDEMPOTENCY_HEADER) ?? crypto.randomUUID();

  try {
    const existing = await prisma.inventoryReservation.findFirst({
      where: {
        checkoutKey: idempotencyKey,
        status: { in: [ReservationStatus.ACTIVE, ReservationStatus.CONVERTED] },
      },
    });

    if (existing) {
      throw new IdempotencyConflictError();
    }

    let stripeClient: Stripe;
    try {
      stripeClient = getStripeClient();
    } catch {
      return NextResponse.json(
        { error: 'Stripe não configurado neste ambiente' },
        { status: 503 },
      );
    }

    const draft = await createOrderDraft({
      ...parsed.data,
      billingAddress: parsed.data.billingAddress ?? parsed.data.shippingAddress,
      checkoutKey: idempotencyKey,
    });

    const amountInCents = Math.round(draft.totals.total.toNumber() * 100);

    const paymentIntent = await stripeClient.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: draft.order.id,
          checkoutKey: idempotencyKey,
        },
        receipt_email: parsed.data.customer.email,
        description: `High-Cost Sneakers Order #${draft.order.id}`,
        shipping: {
          name: parsed.data.customer.name ?? parsed.data.customer.email,
          phone: parsed.data.customer.phone,
          address: {
            line1: parsed.data.shippingAddress.line1,
            line2: parsed.data.shippingAddress.line2 ?? undefined,
            city: parsed.data.shippingAddress.city,
            state: parsed.data.shippingAddress.region ?? undefined,
            postal_code: parsed.data.shippingAddress.postalCode,
            country: parsed.data.shippingAddress.country,
          },
        },
      },
      { idempotencyKey },
    );

    await prisma.payment.update({
      where: { id: draft.payment.id },
      data: {
        paymentIntentId: paymentIntent.id,
        status: mapStripeStatus(paymentIntent.status),
        rawResponse: paymentIntent as unknown as Prisma.InputJsonValue,
      },
    });

    const responsePayload = {
      orderId: draft.order.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: draft.totals.total.toNumber(),
      currency: draft.order.currency,
      reservationExpiresAt: draft.reservations.at(0)?.expiresAt ?? null,
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error) {
    if (
      error instanceof DomainError ||
      error instanceof OutOfStockError ||
      error instanceof VariantUnavailableError ||
      error instanceof IdempotencyConflictError
    ) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('Checkout error', error);
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 });
  }
}
