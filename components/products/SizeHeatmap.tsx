'use client';

import { AvailabilityState } from '@prisma/client';

const palette: Record<AvailabilityState, string> = {
  IN_STOCK: 'from-emerald-400/80 via-emerald-500/70 to-emerald-400/40 shadow-emerald-400/40',
  LOW_STOCK: 'from-amber-400/80 via-amber-500/70 to-amber-400/40 shadow-amber-400/40',
  OUT_OF_STOCK: 'from-red-500/70 via-red-600/70 to-red-500/40 shadow-red-500/40',
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
      <div className="mt-3 space-y-2 text-xs">
        {entries.map(([size, meta]) => {
          const width = Math.min((meta.qtyAvailable / maxQty) * 100, 100);

          return (
            <div key={size} className="flex items-center gap-3">
              <div className="w-14 font-semibold text-white">EU {size}</div>
              <div className="relative flex-1">
                <div className="h-3 w-full rounded-full bg-white/10" aria-hidden />
                <div
                  className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${palette[meta.availability]}`}
                  style={{ width: `${width}%` }}
                  aria-label={`Tamanho ${size} ${meta.availability}`}
                />
              </div>
              <div className="w-16 text-right text-white/70">{meta.qtyAvailable} pares</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
