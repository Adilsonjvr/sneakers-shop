'use client';

import { ProductMode } from '@/lib/products';

import { useLanguage } from '@/components/i18n/LanguageProvider';

export function StoreHero({ mode }: { mode: ProductMode }) {
  const { lang } = useLanguage();
  const isPt = lang === 'pt';

  const title = (() => {
    switch (mode) {
      case 'drop':
        return isPt ? 'Drops ativos' : 'Live releases';
      case 'collector':
        return isPt ? 'Colecionador' : 'Collector';
      default:
        return 'Showroom';
    }
  })();

  return (
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-[0.4em] text-white/50">
        {isPt ? 'Coleção' : 'Collection'}
      </p>
      <h1 className="font-display text-4xl font-semibold">
        Air Jordan Archive — {title}
      </h1>
      <p className="text-white/70">
        {isPt
          ? 'Explora colorways icónicas, reserva durante drops e acompanha o ritmo de cada tamanho.'
          : 'Explore iconic colorways, reserve during drops, and track the heat for each size.'}
      </p>
    </section>
  );
}
