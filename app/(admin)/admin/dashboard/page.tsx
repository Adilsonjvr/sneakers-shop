import { KpiCard } from '@/components/dashboard/KpiCard';
import { DropsWidget } from '@/components/dashboard/DropsWidget';
import { InventoryAlerts } from '@/components/dashboard/InventoryAlerts';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { StockBreakdown } from '@/components/dashboard/StockBreakdown';
import { getDashboardMetrics } from '@/lib/services/metrics';
import { formatCurrency, formatPercent } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const sparkline = metrics.lastSevenDays.map((point) => point.amount);
  const last = sparkline.at(-1) ?? 0;
  const prev = sparkline.at(-2) ?? 0;
  const trend = prev === 0 ? 0 : ((last - prev) / prev) * 100;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <KpiCard
          title="Receita hoje"
          value={formatCurrency(metrics.salesToday.amount)}
          subtitle={`${metrics.salesToday.orders} pedidos`}
          trendLabel={`${trend >= 0 ? '+' : ''}${trend.toFixed(1)}% vs ontem`}
          trendPositive={trend >= 0}
          sparkline={sparkline}
        />
        <KpiCard
          title="Taxa de autorização"
          value={formatPercent(metrics.authorizationRate)}
          subtitle="Stripe SCA/3DS"
          trendLabel="Objetivo ≥ 94%"
          trendPositive={metrics.authorizationRate >= 94}
        />
        <KpiCard
          title="Abandono"
          value={formatPercent(metrics.abandonmentRate)}
          subtitle="Carrinhos pendentes"
          trendLabel="Monitorizar fila"
          trendPositive={metrics.abandonmentRate <= 12}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <StockBreakdown {...metrics.stock} />
        <DropsWidget drops={metrics.drops} />
        <InventoryAlerts alerts={metrics.inventoryAlerts} />
      </section>

      <RecentOrdersTable orders={metrics.recentOrders} />
    </div>
  );
}
