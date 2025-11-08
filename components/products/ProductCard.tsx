'use client';

import { AvailabilityState } from '@prisma/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { useCart } from '@/components/cart/CartProvider';
import { ProductResponse } from '@/lib/products';

import { SizeHeatmap } from './SizeHeatmap';

const availabilityCopy: Record<AvailabilityState, string> = {
  IN_STOCK: 'Disponível',
  LOW_STOCK: 'Últimos pares',
  OUT_OF_STOCK: 'Esgotado',
};

export function ProductCard({ product }: { product: ProductResponse }) {
  const [showSizes, setShowSizes] = useState(false);
  const { addItem } = useCart();

  const sortedVariants = product.variants
    .filter((variant) => variant.sizeEu !== null)
    .sort((a, b) => (a.sizeEu ?? 0) - (b.sizeEu ?? 0));

  const handleQuickAdd = (variantId: string, sizeLabel: string, price: number) => {
    addItem({
      id: variantId,
      productId: product.id,
      variantId,
      name: product.name,
      colorway: product.colorway,
      sizeLabel,
      price,
    });
    setShowSizes(false);
  };

  return (
    <motion.article
      layout
      className="glass-panel relative flex flex-col gap-4 p-5 shadow-card"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-black">
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {product.isDrop && (
            <span className="w-fit rounded-full bg-brand px-3 py-1 text-xs uppercase tracking-[0.3em]">
              Drop
            </span>
          )}
          {product.activeDrop && (
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white/70">
              A iniciar {new Date(product.activeDrop.startAt).toLocaleDateString('pt-PT')}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border border-white/20" />
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">{product.modelLine}</p>
          <Link
            href={`/products/${product.id}`}
            className="text-lg font-semibold transition hover:text-brand"
          >
            {product.name}
          </Link>
          <p className="text-sm text-white/70">{product.colorway}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">{availabilityCopy[sortedVariants[0]?.availabilityState ?? AvailabilityState.IN_STOCK]}</p>
          <p className="text-xl font-semibold">
            € {product.priceRange.min.toFixed(0)}
          </p>
        </div>
      </div>

      <SizeHeatmap sizeHeatmap={product.sizeHeatmap} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/50 hover:text-white"
          onClick={() => setShowSizes((prev) => !prev)}
        >
          Quick add
        </button>
        <Link
          href={`/products/${product.id}`}
          className="text-sm uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
        >
          Ver PDP →
        </Link>
      </div>

      {showSizes && (
        <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">Seleciona tamanho</p>
          <div className="grid grid-cols-4 gap-2 text-sm">
            {sortedVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.availabilityState === AvailabilityState.OUT_OF_STOCK}
                onClick={() =>
                  handleQuickAdd(
                    variant.id,
                    `EU ${variant.sizeEu?.toFixed(1)}`,
                    variant.price,
                  )
                }
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  variant.availabilityState === AvailabilityState.OUT_OF_STOCK
                    ? 'cursor-not-allowed border border-white/10 text-white/30'
                    : 'border border-white/20 text-white/80 hover:border-white hover:text-white'
                }`}
              >
                EU {variant.sizeEu?.toFixed(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
}
