'use client';

import { AvailabilityState } from '@prisma/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { useCart } from '@/components/cart/CartProvider';
import { ProductResponse } from '@/lib/products';

import { SizeHeatmap } from './SizeHeatmap';
import { ProductHeroImage } from './ProductHeroImage';

const availabilityCopy: Record<
  'pt' | 'en',
  Record<AvailabilityState, string>
> = {
  pt: {
    IN_STOCK: 'Disponível',
    LOW_STOCK: 'Poucas unidades',
    OUT_OF_STOCK: 'Esgotado',
  },
  en: {
    IN_STOCK: 'In stock',
    LOW_STOCK: 'Low stock',
    OUT_OF_STOCK: 'Sold out',
  },
};

const copy = {
  pt: {
    lineLabel: 'Linha',
    colorwayLabel: 'Colorway',
    drop: 'Drop',
    starts: 'Inicia',
    quickAdd: 'Adicionar rápido',
    viewProduct: 'Ver detalhes',
    selectSize: 'Selecionar tamanho',
  },
  en: {
    lineLabel: 'Line',
    colorwayLabel: 'Colorway',
    drop: 'Drop',
    starts: 'Starts',
    quickAdd: 'Quick add',
    viewProduct: 'View details',
    selectSize: 'Select size',
  },
};

export function ProductCard({ product }: { product: ProductResponse }) {
  const [showSizes, setShowSizes] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, active: false });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addItem } = useCart();
  const { lang } = useLanguage();
  const t = copy[lang];
  const availabilityLabel = availabilityCopy[lang];

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
      imageUrl: product.heroImageUrl ?? undefined,
    });
    setShowSizes(false);
  };

  return (
    <motion.article
      layout
      className="glass-panel relative flex flex-col gap-4 p-5 shadow-card"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          active: true,
        });
      }}
      onPointerEnter={() => {
        setSpotlight((prev) => ({ ...prev, active: true }));
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => undefined);
        }
      }}
      onPointerLeave={() => setSpotlight((prev) => ({ ...prev, active: false }))}
    >
      <audio ref={audioRef} src="/sound-holofote.mp3" preload="auto" className="hidden" />
      <div
        className="pointer-events-none absolute -top-48 hidden h-80 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/60 via-white/25 to-transparent blur-[90px] transition-all duration-500 md:block"
        style={{
          left: `${spotlight.x}%`,
          opacity: spotlight.active ? 1 : 0,
          transform: `translate(-50%, ${spotlight.active ? '0%' : '-80%'})`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden rounded-[inherit] transition-opacity duration-300 md:block"
        style={{
          opacity: spotlight.active ? 1 : 0,
          background: `radial-gradient(circle at ${spotlight.x}% 0%, rgba(255,255,255,0.15), transparent 60%)`,
          transform: 'translateZ(0)',
          mixBlendMode: 'screen',
        }}
      />
      <ProductHeroImage
        src={product.heroImageUrl}
        alt={product.name}
        overlay={
          <>
            {product.isDrop && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs uppercase tracking-[0.3em]">
                {t.drop}
              </span>
            )}
            {product.activeDrop && (
              <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white/70">
                {t.starts}{' '}
                {new Date(product.activeDrop.startAt).toLocaleDateString(
                  lang === 'pt' ? 'pt-PT' : 'en-US',
                )}
              </span>
            )}
          </>
        }
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            {t.lineLabel}: {product.modelLine}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="text-lg font-semibold transition hover:text-brand"
          >
            {product.name}
          </Link>
          <p className="text-sm text-white/70">
            {t.colorwayLabel}: {product.colorway}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">
            {availabilityLabel[sortedVariants[0]?.availabilityState ?? AvailabilityState.IN_STOCK]}
          </p>
          <p className="text-xl font-semibold">€ {product.priceRange.min.toFixed(0)}</p>
        </div>
      </div>

      <SizeHeatmap sizeHeatmap={product.sizeHeatmap} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-white/20 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-white/70 transition hover:border-white/50 hover:text-white"
          onClick={() => setShowSizes((prev) => !prev)}
        >
          {t.quickAdd}
        </button>
        <Link
          href={`/products/${product.id}`}
          className="text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
        >
          {t.viewProduct} →
        </Link>
      </div>

      {showSizes && (
        <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">{t.selectSize}</p>
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
