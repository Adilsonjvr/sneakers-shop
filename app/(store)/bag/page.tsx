import Link from 'next/link';

import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils/format';

export default function BagPage() {
  const { items } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="glass-panel mx-auto mt-10 flex w-full max-w-4xl flex-col gap-8 bg-black/40 p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Sneaker Sacola</p>
        <h1 className="font-display text-4xl font-semibold text-white">Processo Criativo</h1>
        <p className="text-white/60">
          Esta experiência de checkout é um conceito para portfólio. Sinta-se à vontade para explorar os
          elementos visuais e microinterações, mas não há transações reais em produção.
        </p>
      </header>

      <section className="space-y-6">
        {items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
            Sem itens na sacola — navegue pela coleção e use o quick-add para montar um look.
          </div>
        )}

        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
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

      <footer className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm uppercase tracking-[0.3em] text-white/50">Subtotal</span>
          <span className="text-2xl font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-sm text-white/50">
          Projeção fictícia: impostos, frete e descontos não são calculados aqui. Ideal para apresentar o fluxo
          em portfólios e cases de UI/UX.
        </p>
        <div className="flex flex-col gap-3 text-sm text-white/70">
          <Link
            href="/"
            className="rounded-2xl border border-white/20 px-4 py-3 text-center uppercase tracking-[0.3em] hover:border-white"
          >
            Voltar para o showroom
          </Link>
          <button
            type="button"
            className="rounded-2xl bg-brand px-4 py-3 font-semibold uppercase tracking-[0.3em] text-white"
          >
            Apresentar conceito
          </button>
        </div>
      </footer>
    </div>
  );
}
