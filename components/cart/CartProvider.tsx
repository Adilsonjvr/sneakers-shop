'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  colorway: string;
  sizeLabel: string;
  price: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]),
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 glass-panel px-5 py-3 text-sm shadow-2xl">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-white/60">Sacola</p>
        <p className="text-lg font-semibold">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </p>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve estar dentro do CartProvider');
  }
  return ctx;
}
