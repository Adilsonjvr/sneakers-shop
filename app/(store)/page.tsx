import { Suspense } from 'react';

import { ProductExplorer } from '@/components/products/ProductExplorer';
import { StoreHero } from '@/components/store/StoreHero';
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
  let errorCode: 'missingDb' | 'fetchFailed' | undefined;
  type ProductsPayload = Awaited<ReturnType<typeof fetchProducts>>;
  let initialData: ProductsPayload = {
    data: [],
    pageInfo: { hasNextPage: false, nextCursor: undefined },
  };

  if (!hasDatabaseUrl) {
    errorCode = 'missingDb';
  } else {
    try {
      initialData = await fetchProducts({
        mode,
        limit: 12,
      });
    } catch (error) {
      console.error('Falha ao carregar catálogo', error);
      errorCode = 'fetchFailed';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <StoreHero mode={mode} />
      <Suspense fallback={<div className="text-white/60">Loading...</div>}>
        <ProductExplorer
          initialData={initialData}
          initialMode={mode}
          errorCode={errorCode}
        />
      </Suspense>
    </div>
  );
}
