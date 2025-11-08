'use client';

import { AvailabilityState } from '@prisma/client';

const palette: Record<AvailabilityState, string> = {
  IN_STOCK: 'bg-emerald-400/70',
  LOW_STOCK: 'bg-amber-400/70',
  OUT_OF_STOCK: 'bg-red-500/70',
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
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs font-semibold text-white">
        {entries.map(([size, meta]) => {
          const filled = Math.round((meta.qtyAvailable / maxQty) * 8);
          const indicators = Array.from({ length: 8 }, (_, index) => index < filled);

          return (
            <div key={size} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-sm">EU {size}</span>
              <div className="mt-2 flex gap-1">
                {indicators.map((active, index) => (
                  <span
                    key={`${size}-${index}`}
                    className={`h-1.5 w-2.5 rounded-full ${active ? palette[meta.availability] : 'bg-white/10'}`}
                  />
                ))}
              </div>
              <span className="mt-2 text-[0.65rem] text-white/60">{meta.qtyAvailable} pares</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
