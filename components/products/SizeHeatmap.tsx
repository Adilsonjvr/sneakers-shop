'use client';

import { AvailabilityState } from '@prisma/client';

type SizeHeatmapProps = {
  sizeHeatmap: Record<
    string,
    {
      availability: AvailabilityState;
      qtyAvailable: number;
    }
  >;
};

const statusCopy: Record<AvailabilityState, { pt: string; en: string; badge: string }> = {
  IN_STOCK: {
    pt: 'Disponível',
    en: 'In stock',
    badge: 'bg-emerald-400',
  },
  LOW_STOCK: {
    pt: 'Últimos pares',
    en: 'Low stock',
    badge: 'bg-amber-400',
  },
  OUT_OF_STOCK: {
    pt: 'Esgotado',
    en: 'Sold out',
    badge: 'bg-red-500',
  },
};

export function SizeHeatmap({ sizeHeatmap }: SizeHeatmapProps) {
  const entries = Object.entries(sizeHeatmap).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Tamanhos / Sizes</span>
        <span>Status</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {entries.map(([size, meta]) => {
          const status = statusCopy[meta.availability];
          return (
            <div
              key={size}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80"
            >
              <span className="font-semibold">EU {size}</span>
              <span className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-white/60">
                <span className={`h-2 w-2 rounded-full ${status.badge}`} />
                {status.pt} · {status.en}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-white/40">
        Disponibilidade por tamanho · Size availability
      </p>
    </div>
  );
}
