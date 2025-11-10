'use client';

import { AvailabilityState } from '@prisma/client';
import { useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';

type SizeHeatmapProps = {
  sizeHeatmap: Record<
    string,
    {
      availability: AvailabilityState;
      qtyAvailable: number;
    }
  >;
};

const availabilityStyles: Record<AvailabilityState, string> = {
  IN_STOCK: 'border-white/40 text-white bg-white/10',
  LOW_STOCK: 'border-amber-300/40 text-amber-200 bg-amber-500/10',
  OUT_OF_STOCK: 'border-white/10 text-white/30 line-through',
};

const labels = {
  pt: {
    title: 'Tamanhos',
    toggleShow: 'Ver todos',
    toggleHide: 'Ocultar',
  },
  en: {
    title: 'Sizes',
    toggleShow: 'Show all',
    toggleHide: 'Hide',
  },
};

export function SizeHeatmap({ sizeHeatmap }: SizeHeatmapProps) {
  const entries = Object.entries(sizeHeatmap).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const [expanded, setExpanded] = useState(false);
  const { lang } = useLanguage();
  const t = labels[lang];
  const limit = 8;
  const visibleEntries = expanded ? entries : entries.slice(0, limit);
  const canExpand = entries.length > limit;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.3em] text-white/50">
        <span>{t.title}</span>
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-white/70 underline-offset-4 hover:text-white"
          >
            {expanded ? t.toggleHide : t.toggleShow}
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {visibleEntries.map(([size, meta]) => (
          <span
            key={size}
            className={`flex h-10 w-full items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-[0.2em] ${availabilityStyles[meta.availability]}`}
            title={`EU ${size}`}
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  );
}
