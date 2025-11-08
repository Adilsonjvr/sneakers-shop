'use client';

type StockBreakdownProps = {
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

const colors = {
  inStock: 'bg-emerald-400',
  lowStock: 'bg-amber-400',
  outOfStock: 'bg-red-500',
};

export function StockBreakdown({ inStock, lowStock, outOfStock }: StockBreakdownProps) {
  const total = inStock + lowStock + outOfStock || 1;

  const bars = [
    { label: 'Disponível', value: inStock, className: colors.inStock },
    { label: 'Baixo stock', value: lowStock, className: colors.lowStock },
    { label: 'Esgotado', value: outOfStock, className: colors.outOfStock },
  ];

  return (
    <div className="glass-panel space-y-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stock</p>
        <h3 className="text-2xl font-semibold text-white">{inStock + lowStock} variantes ativas</h3>
      </div>
      <div className="flex h-4 overflow-hidden rounded-full bg-white/10">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={bar.className}
            style={{ width: `${(bar.value / total) * 100}%` }}
            aria-label={`${bar.label}: ${bar.value}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
        {bars.map((bar) => (
          <div key={bar.label}>
            <p className="text-xs uppercase tracking-[0.3em]">{bar.label}</p>
            <p className="text-lg font-semibold text-white">{bar.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
