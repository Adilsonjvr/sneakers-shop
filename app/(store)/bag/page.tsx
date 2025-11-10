'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils/format';

const SHIPPING_FLAT = 15;
const VAT_RATE = 0.23;

export default function BagPage() {
  const { items, removeItem } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const vat = subtotal * VAT_RATE;
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + vat + shipping;

  return (
    <div className="space-y-8">
      <header className="glass-panel space-y-3 border border-white/10 bg-black/50 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Sneaker Sacola</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white">Seleção curada</h1>
            <p className="text-white/60">
              Concept store digital para portfolio: itens adicionados via showroom/quick-add aparecem aqui e podem
              seguir para o checkout fictício.
            </p>
          </div>
          <div className="text-right text-white/70">
            <p className="text-xs uppercase tracking-[0.4em]">Itens</p>
            <p className="text-3xl font-semibold">{items.length.toString().padStart(2, '0')}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
            <span>Itens na sacola</span>
            <span>Story-driven checkout</span>
          </header>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-white/60">
              A sacola está vazia. Use o quick-add dos cards ou explore um PDP para simular a experiência completa.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 md:flex-row md:items-center md:gap-6"
                >
                  <div className="flex items-center gap-4 md:flex-1">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <Image
                        src={item.imageUrl ?? '/icon.svg'}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">{item.colorway}</p>
                      <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                      <p className="text-white/60">{item.sizeLabel}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-white">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
                      <Link href={`/products/${item.productId}`} className="hover:text-white">
                        Ver PDP
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white hover:text-white"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Resumo conceitual</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (23%)</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envio premium</span>
                <span>{shipping ? formatCurrency(shipping) : 'Incluído'}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">Total simulado</span>
              <span className="text-2xl font-semibold text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          <p className="text-sm text-white/60">
            O fluxo não processa pagamentos reais. Ideal para narrar etapas de compra e mostrar consistência visual.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] ${
                items.length
                  ? 'bg-white text-black transition hover:bg-white/80'
                  : 'cursor-not-allowed bg-white/10 text-white/40'
              }`}
              aria-disabled={!items.length}
            >
              Ir para o checkout
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/20 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white"
            >
              Continuar a explorar
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
