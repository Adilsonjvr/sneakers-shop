'use client';

import Link from 'next/link';
import { createContext, useContext, useMemo, useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';

type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  colorway: string;
  sizeLabel: string;
  price: number;
  imageUrl?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { lang } = useLanguage();

  const labels = {
    pt: { bag: 'Sacola', singular: 'item', plural: 'itens' },
    en: { bag: 'Bag', singular: 'item', plural: 'items' },
  } as const;
  const t = labels[lang];

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]),
      removeItem: (id) => setItems((prev) => prev.filter((item) => item.id !== id)),
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <Link
        href="/bag"
        className="fixed bottom-6 right-6 glass-panel px-5 py-3 text-sm shadow-2xl transition hover:scale-[1.02]"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-white/60">{t.bag}</p>
        <p className="text-lg font-semibold">
          {items.length} {items.length === 1 ? t.singular : t.plural}
        </p>
      </Link>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve estar dentro do CartProvider / useCart must be inside CartProvider');
  }
  return ctx;
}
