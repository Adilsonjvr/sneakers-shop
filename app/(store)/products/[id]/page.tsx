import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetail } from '@/components/products/ProductDetail';
import { hasDatabaseUrl } from '@/lib/env';
import { fetchProductById, fetchProducts } from '@/lib/products';
import type { ProductResponse } from '@/lib/products';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  let productError: string | undefined;
  let product: ProductResponse | null = null;

  if (!hasDatabaseUrl) {
    productError = 'DATABASE_URL não configurado. Não é possível carregar o produto.';
  } else {
    try {
      product = await fetchProductById(params.id);
    } catch (error) {
      console.error('Falha ao carregar produto', error);
      productError = 'Não foi possível ligar à base de dados para carregar este produto.';
    }
  }

  if (!product) {
    if (productError) {
      return (
        <div className="glass-panel mx-auto mt-10 max-w-2xl px-6 py-8 text-center text-white">
          <p>{productError}</p>
        </div>
      );
    }
    notFound();
  }

  type ProductsPayload = Awaited<ReturnType<typeof fetchProducts>>;
  let related: ProductsPayload = { data: [], pageInfo: { hasNextPage: false } };
  if (hasDatabaseUrl) {
    try {
      related = await fetchProducts({
        limit: 6,
        modelLine: product.modelLine,
      });
    } catch (error) {
      console.error('Falha ao carregar produtos relacionados', error);
    }
  }

  const filteredRelated = related.data.filter((item) => item.id !== product.id);

  const showroomRoute = '/' as Route;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={showroomRoute}
        className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
      >
        ← voltar ao showroom
      </Link>
      <ProductDetail product={product} relatedColorways={filteredRelated} />
    </div>
  );
}
