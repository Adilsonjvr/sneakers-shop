import {
  AvailabilityState,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';

import { prisma } from '@/lib/prisma';

type DailySalesPoint = {
  label: string;
  amount: number;
};

type StockSnapshot = {
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

type DropSummary = {
  id: string;
  productName: string;
  startAt: string;
  endAt: string | null;
  status: 'upcoming' | 'live' | 'ended';
};

type RecentOrder = {
  id: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
};

export type DashboardMetrics = {
  salesToday: {
    amount: number;
    orders: number;
  };
  lastSevenDays: DailySalesPoint[];
  authorizationRate: number;
  abandonmentRate: number;
  stock: StockSnapshot;
  drops: DropSummary[];
  recentOrders: RecentOrder[];
  inventoryAlerts: {
    sku: string;
    productName: string;
    qtyOnHand: number;
  }[];
};

const decimalToNumber = (value: Prisma.Decimal) => Number(value.toString());

const buildStockSnapshot = (
  grouped: { availabilityState: AvailabilityState; _count: number }[],
): StockSnapshot => {
  const base: StockSnapshot = { inStock: 0, lowStock: 0, outOfStock: 0 };
  for (const item of grouped) {
    if (item.availabilityState === AvailabilityState.IN_STOCK) base.inStock = item._count;
    if (item.availabilityState === AvailabilityState.LOW_STOCK) base.lowStock = item._count;
    if (item.availabilityState === AvailabilityState.OUT_OF_STOCK) base.outOfStock = item._count;
  }
  return base;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date();
  const today = startOfDay(now);
  const rangeStart = subDays(today, 6);
  const days = eachDayOfInterval({ start: rangeStart, end: today });

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: rangeStart } },
    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      customer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const salesByDay = days.map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    const dailyOrders = orders.filter(
      (order) => format(order.createdAt, 'yyyy-MM-dd') === key,
    );
    const amount = dailyOrders.reduce(
      (sum, order) => sum + decimalToNumber(order.totalAmount),
      0,
    );
    return { label: format(day, 'dd/MM'), amount };
  });

  const todayKey = format(today, 'yyyy-MM-dd');
  const todayOrders = orders.filter(
    (order) => format(order.createdAt, 'yyyy-MM-dd') === todayKey,
  );

  const paymentsTotal = await prisma.payment.count();
  const paymentsAuthorized = await prisma.payment.count({
    where: {
      status: { in: [PaymentStatus.AUTHORIZED, PaymentStatus.SUCCEEDED, PaymentStatus.CAPTURED] },
    },
  });

  const pendingOrders = orders.filter((order) => order.status === OrderStatus.PENDING_PAYMENT);
  const abandonmentRate =
    orders.length === 0 ? 0 : (pendingOrders.length / orders.length) * 100;
  const authorizationRate =
    paymentsTotal === 0 ? 0 : (paymentsAuthorized / paymentsTotal) * 100;

  const groupedStock = await prisma.variant.groupBy({
    by: ['availabilityState'],
    _count: true,
  });
  const stock = buildStockSnapshot(groupedStock);

  const dropsRaw = await prisma.drop.findMany({
    orderBy: { startAt: 'asc' },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      product: { select: { name: true } },
    },
    take: 5,
  });

  const drops: DropSummary[] = dropsRaw.map((drop) => ({
    id: drop.id,
    productName: drop.product.name,
    startAt: drop.startAt.toISOString(),
    endAt: drop.endAt ? drop.endAt.toISOString() : null,
    status:
      drop.startAt <= now && (!drop.endAt || drop.endAt >= now)
        ? 'live'
        : drop.startAt > now
        ? 'upcoming'
        : 'ended',
  }));

  const recentOrders: RecentOrder[] = orders
    .slice(-5)
    .reverse()
    .map((order) => ({
      id: order.id,
      status: order.status,
      total: decimalToNumber(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      customerName: order.customer?.name || order.customer?.email || 'Guest',
    }));

  const inventoryAlertsRaw = await prisma.variant.findMany({
    where: {
      inventory: {
        is: {
          qtyOnHand: { lte: 5 },
        },
      },
    },
    select: {
      id: true,
      sku: true,
      product: { select: { name: true } },
      inventory: { select: { qtyOnHand: true } },
    },
    take: 5,
  });

  const inventoryAlerts = inventoryAlertsRaw.map((variant) => ({
    sku: variant.sku,
    productName: variant.product.name,
    qtyOnHand: variant.inventory?.qtyOnHand ?? 0,
  }));

  return {
    salesToday: {
      amount: todayOrders.reduce(
        (sum, order) => sum + decimalToNumber(order.totalAmount),
        0,
      ),
      orders: todayOrders.length,
    },
    lastSevenDays: salesByDay,
    authorizationRate,
    abandonmentRate,
    stock,
    drops,
    recentOrders,
    inventoryAlerts,
  };
}
