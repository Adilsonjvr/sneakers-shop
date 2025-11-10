'use client';

import { AvailabilityState } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { useCart } from '@/components/cart/CartProvider';
import { ProductResponse } from '@/lib/products';

import { ColorwaySwitcher } from './ColorwaySwitcher';
import { DropQueueJoiner } from './DropQueueJoiner';
import { ProductHeroImage } from './ProductHeroImage';

type ProductDetailProps = {
  product: ProductResponse;
  relatedColorways: ProductResponse[];
};

const productInsights: Record<
  string,
  {
    story: { pt: string; en: string };
    highlights: Array<{ pt: string; en: string }>;
  }
> = {
  'Air Jordan 1 Retro High OG "Chicago 1985"': {
    story: {
      pt: 'Reedição fiel do par usado por MJ na temporada de estreia — couro vermelho varsity, painéis brancos e swoosh preto com acabamento semi-brilhante.',
      en: 'Faithful reissue of the pair MJ wore during his rookie season — varsity red leather, crisp white panels, and semi-gloss black swoosh.',
    },
    highlights: [
      {
        pt: 'Etiqueta Nike Air o.g. na língua em nylon espesso.',
        en: 'Original Nike Air tongue tag on thick nylon.',
      },
      {
        pt: 'Colar acolchoado com espuma exposta para look vintage.',
        en: 'Padded collar with exposed foam for a vintage look.',
      },
      {
        pt: 'Palmilha Ortholite personalizada com gráfico Wings.',
        en: 'Custom Ortholite insole featuring the Wings graphic.',
      },
    ],
  },
  'Air Jordan 1 Retro High OG "Hyper Royal"': {
    story: {
      pt: 'Suede tingido com lavagem ácida inspirado nos murais de LA, combinado com swoosh cinzento e midsole off-white.',
      en: 'Acid-washed suede inspired by LA murals, paired with grey swoosh and aged off-white midsole.',
    },
    highlights: [
      { pt: 'Camurça premium com acabamento desbotado.', en: 'Premium suede with sun-faded finish.' },
      { pt: 'Cordões em algodão cru e opção extra em azul.', en: 'Raw cotton laces plus alternate blue set.' },
      { pt: 'Forro em malha respirável para uso diário.', en: 'Breathable mesh lining for daily wear.' },
    ],
  },
  'Air Jordan 4 Retro "Military Black"': {
    story: {
      pt: 'Mistura do bloco “Military Blue” de 1989 com contrastes em preto, mantendo as asas em TPU e a entressola com unidade visível.',
      en: 'Blend of the 1989 “Military Blue” blocking with black contrasts, keeping TPU wings and the visible Air midsole.',
    },
    highlights: [
      { pt: 'Grade lateral reforçada com mesh de alto fluxo.', en: 'Reinforced side netting with high-flow mesh.' },
      { pt: 'Palmilha com logo Flight bordado.', en: 'Flight embroidered logo on the insole.' },
      { pt: 'Borracha herringbone para tração urbana.', en: 'Herringbone rubber outsole built for street grip.' },
    ],
  },
  'Air Jordan 11 Retro "Jubilee 25th"': {
    story: {
      pt: 'Celebra os 25 anos do AJ11 com verniz profundo, debrum metálico e logotipo “Jordan” em cada ilhó.',
      en: 'Celebrates 25 years of AJ11 with rich patent leather, metallic piping, and “Jordan” lettering across the eyelets.',
    },
    highlights: [
      { pt: 'Cabedal em mesh balístico preto.', en: 'Black ballistic mesh upper.' },
      { pt: 'Placa de fibra de carbono exposta na sola.', en: 'Exposed carbon-fiber plate underfoot.' },
      { pt: 'Detalhes cromados inspirados no protótipo original.', en: 'Chrome hits inspired by the original prototype.' },
    ],
  },
};

const copy = {
  pt: {
    line: 'Linha',
    colorway: 'Colorway',
    priceFallback: 'Consultar',
    story: 'Story',
    selectSize: 'Selecionar tamanho',
    addToBag: 'Adicionar à sacola',
    dropBadge: 'Drop exclusivo',
    highlights: 'Destaques',
  },
  en: {
    line: 'Line',
    colorway: 'Colorway',
    priceFallback: 'Contact us',
    story: 'Story',
    selectSize: 'Select size',
    addToBag: 'Add to bag',
    dropBadge: 'Exclusive drop',
    highlights: 'Highlights',
  },
};

export function ProductDetail({ product, relatedColorways }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(() => product.variants[0]);
  const [sizeUnit, setSizeUnit] = useState<'EU' | 'US'>('EU');
  const gallery = useMemo(() => {
    if (product.galleryImages.length) return product.galleryImages;
    return product.heroImageUrl ? [product.heroImageUrl] : [];
  }, [product.galleryImages, product.heroImageUrl]);
  const [activeImage, setActiveImage] = useState<string | undefined>(product.heroImageUrl ?? gallery[0]);
  const { lang } = useLanguage();
  const t = copy[lang];

  const resolveSizeLabel = (variant?: ProductResponse['variants'][number]) => {
    if (!variant) return 'N/A';
    const raw = sizeUnit === 'EU' ? variant.sizeEu : variant.sizeUs;
    if (!raw) return 'N/A';
    const formatted = sizeUnit === 'EU' ? raw.toFixed(1) : raw.toFixed(1);
    return `${sizeUnit} ${formatted}`;
  };

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      colorway: product.colorway,
      sizeLabel: resolveSizeLabel(selectedVariant),
      price: selectedVariant.price,
      imageUrl: product.heroImageUrl ?? gallery[0] ?? undefined,
    });
  };

  return (
    <div className="glass-panel grid gap-10 p-8 md:grid-cols-2">
      <motion.div layout className="space-y-4">
        <ProductHeroImage
          src={activeImage}
          alt={product.name}
          overlay={
            product.isDrop && (
              <div className="absolute left-6 top-6 rounded-full bg-brand px-4 py-1 text-xs uppercase tracking-[0.3em]">
                {t.dropBadge}
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
                <Image src={image} alt={`${product.name} detail`} fill className="object-contain" sizes="25vw" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            {t.line}: {product.modelLine}
          </p>
          <h1 className="font-display text-4xl font-semibold text-white">{product.name}</h1>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            {t.colorway}: {product.colorway}
          </p>
          <p className="text-2xl font-semibold text-white">
            {selectedVariant ? `€ ${selectedVariant.price.toFixed(2)}` : t.priceFallback}
          </p>
        </div>
        <StoryBlock product={product} lang={lang} copy={t} />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
            <span>{t.selectSize}</span>
            <div className="flex rounded-full border border-white/15 bg-black/30 text-[0.6rem] font-semibold uppercase">
              {(['EU', 'US'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setSizeUnit(unit)}
                  className={`px-2 py-1 ${sizeUnit === unit ? 'bg-white text-black' : 'text-white/60'}`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
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
                {resolveSizeLabel(variant)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={!selectedVariant || selectedVariant.availabilityState === AvailabilityState.OUT_OF_STOCK}
            className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.addToBag} — € {selectedVariant?.price.toFixed(2)}
          </button>
        </div>

        <ColorwaySwitcher options={relatedColorways} currentId={product.id} />

        {product.activeDrop && product.activeDrop.id && (
          <DropQueueJoiner dropId={product.activeDrop.id} />
        )}
      </div>
    </div>
  );
}

type StoryBlockProps = {
  product: ProductResponse;
  lang: 'pt' | 'en';
  copy: typeof copy[keyof typeof copy];
};

function StoryBlock({ product, lang, copy: labels }: StoryBlockProps) {
  const fallback = productInsights[product.name];
  const storyHtml = product.storyHtml;
  const highlights = fallback?.highlights ?? [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">{labels.story}</p>
        {storyHtml ? (
          <div
            className="prose prose-invert max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: storyHtml }}
          />
        ) : fallback ? (
          <p className="text-white/70">{fallback.story[lang]}</p>
        ) : (
          <p className="text-white/60">Details coming soon.</p>
        )}
      </div>
      {highlights.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{labels.highlights}</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {highlights.map((item) => (
              <li key={item.en} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                <span>{item[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
