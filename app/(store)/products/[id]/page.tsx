import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductDetail } from '@/components/products/ProductDetail';
import { fetchProductById, fetchProducts } from '@/lib/products';

type ProductPageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  const related = await fetchProducts({
    limit: 6,
    modelLine: product.modelLine,
  });

  const filteredRelated = related.data.filter((item) => item.id !== product.id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white">
        ← voltar ao showroom
      </Link>
      <ProductDetail product={product} relatedColorways={filteredRelated} />
    </div>
  );
}
