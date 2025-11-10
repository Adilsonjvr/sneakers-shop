import { Suspense } from 'react';

import { ProductExplorer } from '@/components/products/ProductExplorer';
import { hasDatabaseUrl } from '@/lib/env';
import { fetchProducts, ProductMode } from '@/lib/products';

export const dynamic = 'force-dynamic';

type StorePageProps = {
  searchParams?: {
    mode?: ProductMode;
  };
};

export default async function StorePage({ searchParams }: StorePageProps) {
  const mode = (searchParams?.mode as ProductMode | undefined) ?? 'showroom';
  let errorMessage: string | undefined;
  type ProductsPayload = Awaited<ReturnType<typeof fetchProducts>>;
  let initialData: ProductsPayload = {
    data: [],
    pageInfo: { hasNextPage: false, nextCursor: undefined },
  };

  if (!hasDatabaseUrl) {
    errorMessage =
      'DATABASE_URL não configurado. Define uma base de dados remota antes de continuar. / DATABASE_URL missing. Configure a remote database before continuing.';
  } else {
    try {
      initialData = await fetchProducts({
        mode,
        limit: 12,
      });
    } catch (error) {
      console.error('Falha ao carregar catálogo', error);
      errorMessage =
        'Não foi possível ligar à base de dados. Define DATABASE_URL acessível no projeto Vercel. / Unable to reach the database. Provide a reachable DATABASE_URL (e.g. Supabase) for this Vercel project.';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Coleção · Collection</p>
        <h1 className="font-display text-4xl font-semibold">
          Air Jordan Archive —{' '}
          {mode === 'drop'
            ? 'Drops ativos · Live releases'
            : mode === 'collector'
              ? 'Colecionador · Collector'
              : 'Showroom'}
        </h1>
        <p className="text-white/70">
          Explora colorways icónicas, reserva durante drops e acompanha o calor de cada tamanho em tempo real. / Explore
          iconic colorways, reserve during drops, and monitor heat per size in real time.
        </p>
      </section>
      <Suspense fallback={<div className="text-white/60">A carregar catálogo / Loading catalog...</div>}>
        <ProductExplorer
          initialData={initialData}
          initialMode={mode}
          errorMessage={errorMessage}
        />
      </Suspense>
    </div>
  );
}
