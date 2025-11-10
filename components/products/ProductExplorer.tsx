'use client';

import { ModelLine } from '@prisma/client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { ProductMode, ProductResponse } from '@/lib/products';

import { ProductCard } from '@/components/products/ProductCard';

type ProductExplorerProps = {
  initialData: { data: ProductResponse[] };
  initialMode: ProductMode;
  errorCode?: 'missingDb' | 'fetchFailed';
};

const modeOptions: Array<{ value: ProductMode; labelKey: 'showroom' | 'drops' | 'collector' }> = [
  { value: 'showroom', labelKey: 'showroom' },
  { value: 'drop', labelKey: 'drops' },
  { value: 'collector', labelKey: 'collector' },
];

const lineOptions: Array<{ value: ModelLine | 'all'; labelKey: 'all' | 'aj1' | 'aj3' | 'aj4' | 'aj11' }> = [
  { labelKey: 'all', value: 'all' },
  { labelKey: 'aj1', value: ModelLine.AJ1 },
  { labelKey: 'aj3', value: ModelLine.AJ3 },
  { labelKey: 'aj4', value: ModelLine.AJ4 },
  { labelKey: 'aj11', value: ModelLine.AJ11 },
];

const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export function ProductExplorer({ initialData, initialMode, errorCode }: ProductExplorerProps) {
  const [mode, setMode] = useState<ProductMode>(initialMode);
  const [modelLine, setModelLine] = useState<ModelLine | 'all'>('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductResponse[]>(initialData.data);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const copy = useMemo(
    () => ({
      pt: {
        subtitle: {
          showroom: 'Colorways históricos curados pelo showroom',
          drop: 'Fila e reservas em tempo real',
          collector: 'Pairs raros para portfólios',
        },
        search: 'Pesquisar modelo ou colorway',
        syncing: 'A sincronizar stock...',
        empty: 'Nenhum par corresponde aos filtros.',
        errors: {
          missingDb: 'Adiciona o DATABASE_URL para carregar o catálogo.',
          fetchFailed: 'Não foi possível ligar à base de dados.',
        },
        modes: {
          showroom: 'Showroom',
          drops: 'Drops',
          collector: 'Colecionador',
        },
        lines: {
          all: 'Todas',
          aj1: 'AJ1',
          aj3: 'AJ3',
          aj4: 'AJ4',
          aj11: 'AJ11',
        },
      },
      en: {
        subtitle: {
          showroom: 'Curated heritage colorways',
          drop: 'Live queue & reservations',
          collector: 'Rare portfolio-ready pairs',
        },
        search: 'Search model or colorway',
        syncing: 'Syncing stock...',
        empty: 'No products found for these filters.',
        errors: {
          missingDb: 'Add a DATABASE_URL to load the catalog.',
          fetchFailed: 'Unable to reach the database.',
        },
        modes: {
          showroom: 'Showroom',
          drops: 'Releases',
          collector: 'Collector',
        },
        lines: {
          all: 'All',
          aj1: 'AJ1',
          aj3: 'AJ3',
          aj4: 'AJ4',
          aj11: 'AJ11',
        },
      },
    }),
    [],
  );

  const t = copy[lang];

  const debouncedSearch = useDebouncedValue(search, 500);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          mode,
          limit: '24',
        });

        if (modelLine !== 'all') {
          params.set('modelLine', modelLine);
        }
        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to load catalog');
        }
        const payload = await response.json();
        if (!cancelled) {
          setProducts(payload.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [mode, modelLine, debouncedSearch]);

  const subtitle = useMemo(() => {
    if (mode === 'drop') return t.subtitle.drop;
    if (mode === 'collector') return t.subtitle.collector;
    return t.subtitle.showroom;
  }, [mode, t]);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel flex flex-col gap-4 px-6 py-5">
        {errorCode && (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {t.errors[errorCode]}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] transition ${
                mode === option.value
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {t.modes[option.labelKey]}
            </button>
          ))}
        </div>
        <p className="text-white/60">{subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <input
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none focus:border-white/40"
            placeholder={t.search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex gap-2 overflow-auto">
            {lineOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setModelLine(option.value)}
                className={`rounded-full px-3 py-2 text-xs uppercase tracking-[0.3em] transition ${
                  modelLine === option.value
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {t.lines[option.labelKey]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <p className="text-white/60">{t.syncing}</p>}

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {!loading && products.length === 0 && (
        <p className="text-center text-white/40">{t.empty}</p>
      )}
    </div>
  );
}
