'use client';

import { ModelLine } from '@prisma/client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { ProductMode, ProductResponse } from '@/lib/products';

import { ProductCard } from '@/components/products/ProductCard';

type ProductExplorerProps = {
  initialData: { data: ProductResponse[] };
  initialMode: ProductMode;
};

const modeOptions: { label: string; value: ProductMode }[] = [
  { label: 'Showroom', value: 'showroom' },
  { label: 'Drops', value: 'drop' },
  { label: 'Colecionador', value: 'collector' },
];

const lineOptions: { label: string; value: ModelLine | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'AJ1', value: ModelLine.AJ1 },
  { label: 'AJ3', value: ModelLine.AJ3 },
  { label: 'AJ4', value: ModelLine.AJ4 },
  { label: 'AJ11', value: ModelLine.AJ11 },
];

const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export function ProductExplorer({ initialData, initialMode }: ProductExplorerProps) {
  const [mode, setMode] = useState<ProductMode>(initialMode);
  const [modelLine, setModelLine] = useState<ModelLine | 'all'>('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductResponse[]>(initialData.data);
  const [loading, setLoading] = useState(false);

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
          throw new Error('Erro ao carregar catálogo');
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
    if (mode === 'drop') return 'Fila, reservas e calor em tempo real';
    if (mode === 'collector') return 'Error-free pairs para portfólios raros';
    return 'Colorways históricos curados pelo nosso showroom';
  }, [mode]);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel flex flex-col gap-4 px-6 py-5">
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
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-white/60">{subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <input
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none focus:border-white/40"
            placeholder="Pesquisar por modelo ou colorway"
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
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <p className="text-white/60">A sincronizar stock e calor...</p>}

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {!loading && products.length === 0 && (
        <p className="text-center text-white/40">Nenhum par corresponde aos filtros.</p>
      )}
    </div>
  );
}
