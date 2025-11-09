'use client';

import { AvailabilityState } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { useCart } from '@/components/cart/CartProvider';
import { ProductResponse } from '@/lib/products';

import { ColorwaySwitcher } from './ColorwaySwitcher';
import { DropQueueJoiner } from './DropQueueJoiner';
import { SizeHeatmap } from './SizeHeatmap';
import { TiltedHero } from './TiltedHero';

type ProductDetailProps = {
  product: ProductResponse;
  relatedColorways: ProductResponse[];
};

export function ProductDetail({ product, relatedColorways }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(() => product.variants[0]);
  const gallery = useMemo(() => {
    if (product.galleryImages.length) return product.galleryImages;
    return product.heroImageUrl ? [product.heroImageUrl] : [];
  }, [product.galleryImages, product.heroImageUrl]);
  const [activeImage, setActiveImage] = useState<string | undefined>(product.heroImageUrl ?? gallery[0]);

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      colorway: product.colorway,
      sizeLabel: selectedVariant.sizeEu ? `EU ${selectedVariant.sizeEu.toFixed(1)}` : 'N/A',
      price: selectedVariant.price,
    });
  };

  return (
    <div className="glass-panel grid gap-10 p-8 md:grid-cols-2">
      <motion.div layout className="space-y-4">
        <TiltedHero
          src={activeImage}
          alt={product.name}
          overlay={
            product.isDrop && (
              <div className="absolute left-6 top-6 rounded-full bg-brand px-4 py-1 text-xs uppercase tracking-[0.3em]">
                Drop exclusivo
              </div>
            )
          }
        />
        {gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`relative h-20 overflow-hidden rounded-2xl border ${
                  activeImage === image ? 'border-brand' : 'border-white/10'
                } bg-white/5 transition`}
              >
                <Image src={image} alt={`${product.name} detalhe`} fill className="object-contain" sizes="25vw" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Story</p>
          <div
            className="prose prose-invert max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: product.storyHtml ?? '<p>Story forthcoming.</p>' }}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Seleciona tamanho</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.availabilityState === AvailabilityState.OUT_OF_STOCK}
                onClick={() => setSelectedVariant(variant)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  selectedVariant?.id === variant.id
                    ? 'bg-white text-black'
                    : 'bg-black/20 text-white/70 hover:bg-white/10'
                } ${
                  variant.availabilityState === AvailabilityState.OUT_OF_STOCK
                    ? 'cursor-not-allowed opacity-40'
                    : ''
                }`}
              >
                EU {variant.sizeEu?.toFixed(1)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={!selectedVariant || selectedVariant.availabilityState === AvailabilityState.OUT_OF_STOCK}
            className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Adicionar — € {selectedVariant?.price.toFixed(2)}
          </button>
        </div>

        <SizeHeatmap sizeHeatmap={product.sizeHeatmap} />
        <ColorwaySwitcher options={relatedColorways} currentId={product.id} />

        {product.activeDrop && product.activeDrop.id && (
          <DropQueueJoiner dropId={product.activeDrop.id} />
        )}
      </div>
    </div>
  );
}
