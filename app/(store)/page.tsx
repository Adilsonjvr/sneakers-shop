import { Suspense } from 'react';

import { ProductExplorer } from '@/components/products/ProductExplorer';
import { fetchProducts, ProductMode } from '@/lib/products';

type StorePageProps = {
  searchParams?: {
    mode?: ProductMode;
  };
};

export default async function StorePage({ searchParams }: StorePageProps) {
  const mode = (searchParams?.mode as ProductMode | undefined) ?? 'showroom';

  const initialData = await fetchProducts({
    mode,
    limit: 12,
  });

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Coleção</p>
        <h1 className="font-display text-4xl font-semibold">
          Air Jordan Archive — {mode === 'drop' ? 'Drops ativos' : mode === 'collector' ? 'Colecionador' : 'Showroom'}
        </h1>
        <p className="text-white/70">
          Explora colorways icónicas, reserva durante drops e acompanha o calor de cada tamanho em tempo real.
        </p>
      </section>
      <Suspense fallback={<div className="text-white/60">A carregar catálogo...</div>}>
        <ProductExplorer initialData={initialData} initialMode={mode} />
      </Suspense>
    </div>
  );
}
