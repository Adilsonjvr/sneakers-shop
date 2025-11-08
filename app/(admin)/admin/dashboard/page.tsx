import { KpiCard } from '@/components/dashboard/KpiCard';
import { DropsWidget } from '@/components/dashboard/DropsWidget';
import { InventoryAlerts } from '@/components/dashboard/InventoryAlerts';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { StockBreakdown } from '@/components/dashboard/StockBreakdown';
import { hasDatabaseUrl } from '@/lib/env';
import { DashboardMetrics, getDashboardMetrics } from '@/lib/services/metrics';
import { formatCurrency, formatPercent } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

const fallbackMetrics: DashboardMetrics = {
  salesToday: { amount: 0, orders: 0 },
  lastSevenDays: [],
  authorizationRate: 0,
  abandonmentRate: 0,
  stock: { inStock: 0, lowStock: 0, outOfStock: 0 },
  drops: [],
  recentOrders: [],
  inventoryAlerts: [],
};

export default async function DashboardPage() {
  let metrics = fallbackMetrics;
  let errorMessage: string | undefined;

  if (!hasDatabaseUrl) {
    errorMessage = 'DATABASE_URL não configurado. Dashboard depende de uma base de dados ativa.';
  } else {
    try {
      metrics = await getDashboardMetrics();
    } catch (error) {
      console.error('Falha ao carregar métricas do dashboard', error);
      errorMessage = 'Dashboard offline (BD indisponível). Verifica DATABASE_URL no ambiente.';
    }
  }
  const sparkline = metrics.lastSevenDays.map((point) => point.amount);
  const last = sparkline.at(-1) ?? 0;
  const prev = sparkline.at(-2) ?? 0;
  const trend = prev === 0 ? 0 : ((last - prev) / prev) * 100;

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
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
