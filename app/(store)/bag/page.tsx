'use client';

import Link from 'next/link';

import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils/format';

export default function BagPage() {
  const { items } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="glass-panel mx-auto flex w-full max-w-4xl flex-col gap-8 bg-black/40 p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Sneaker Sacola</p>
        <h1 className="font-display text-4xl font-semibold text-white">Conceito de Checkout</h1>
        <p className="text-white/60">
          Página criada para portfólio: microinterações, storytelling e UI sem processar pagamentos reais. Use-a
          para guiar narrativas de produto e demonstrar o fluxo de compra.
        </p>
      </header>

      <section className="space-y-4">
        {items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
            A sacola está vazia. Volte ao showroom e utilize o quick-add nos cards para popular o conceito.
          </div>
        )}

        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.colorway}</p>
              <h2 className="text-2xl font-semibold text-white">{item.name}</h2>
              <p className="text-white/60">{item.sizeLabel}</p>
            </div>
            <p className="text-xl font-semibold text-white">{formatCurrency(item.price)}</p>
          </article>
        ))}
      </section>

      <footer className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm uppercase tracking-[0.3em] text-white/50">Subtotal conceitual</span>
          <span className="text-2xl font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-sm text-white/60">
          Impostos, frete e descontos são fictícios neste protótipo. Ideal para demonstrar storytelling e
          argumentação de produto em apresentações.
        </p>
        <div className="flex flex-col gap-3 text-sm text-white/70 md:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-2xl border border-white/20 px-4 py-3 text-center uppercase tracking-[0.3em] hover:border-white"
          >
            Voltar ao showroom
          </Link>
          <button
            type="button"
            className="flex-1 rounded-2xl bg-brand px-4 py-3 font-semibold uppercase tracking-[0.3em] text-white"
          >
            Apresentar conceito
          </button>
        </div>
      </footer>
    </div>
  );
}
