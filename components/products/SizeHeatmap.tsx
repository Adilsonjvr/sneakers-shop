'use client';

import { AvailabilityState } from '@prisma/client';

const palette: Record<AvailabilityState, string> = {
  IN_STOCK: 'bg-brand/40 text-white',
  LOW_STOCK: 'bg-orange-400/40 text-white',
  OUT_OF_STOCK: 'bg-red-500/30 text-white/60',
};

type SizeHeatmapProps = {
  sizeHeatmap: Record<
    string,
    {
      availability: AvailabilityState;
      qtyAvailable: number;
    }
  >;
};

export function SizeHeatmap({ sizeHeatmap }: SizeHeatmapProps) {
  const entries = Object.entries(sizeHeatmap).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const maxQty = entries.reduce((max, [, meta]) => Math.max(max, meta.qtyAvailable), 0) || 1;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Heatmap tamanhos</p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {entries.map(([size, meta]) => (
          <div
            key={size}
            className={`rounded-xl px-3 py-2 ${palette[meta.availability]}`}
          >
            <p>EU {size}</p>
            <p className="text-[0.65rem] opacity-80">{meta.qtyAvailable} pares</p>
          </div>
        ))}
      </div>
    </div>
  );
}
