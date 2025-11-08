'use client';

type InventoryAlertsProps = {
  alerts: {
    sku: string;
    productName: string;
    qtyOnHand: number;
  }[];
};

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  return (
    <div className="glass-panel space-y-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Alertas</p>
        <h3 className="text-2xl font-semibold text-white">Variantes críticas</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.sku}
            className="rounded-2xl border border-white/10 px-4 py-3"
          >
            <p className="font-semibold text-white">{alert.productName}</p>
            <p className="font-mono text-xs text-white/60">{alert.sku}</p>
            <p className="text-sm text-amber-300">{alert.qtyOnHand} pares restantes</p>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-sm text-white/60">Sem alertas — stock saudável.</p>
        )}
      </div>
    </div>
  );
}
