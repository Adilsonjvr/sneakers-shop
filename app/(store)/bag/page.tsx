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
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Sneaker Sacola · Sneaker bag</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white">Seleção curada · Curated selection</h1>
            <p className="text-white/60">
              Concept store digital para portfolio: itens adicionados via showroom/quick-add aparecem aqui e podem seguir
              para o checkout fictício. / Digital concept store for portfolio: items added via showroom/quick-add land
              here and can continue to the mock checkout.
            </p>
          </div>
          <div className="text-right text-white/70">
            <p className="text-xs uppercase tracking-[0.4em]">Itens · Items</p>
            <p className="text-3xl font-semibold">{items.length.toString().padStart(2, '0')}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
            <span>Itens na sacola · Items in bag</span>
            <span>Story-driven checkout · Portfolio flow</span>
          </header>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-white/60">
              A sacola está vazia. Use o quick-add dos cards ou explore um produto para simular a experiência
              completa. / Your bag is empty. Use quick-add on the cards or open a product page to simulate the full
              journey.
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
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                        {item.colorway} · Colorway
                      </p>
                      <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                      <p className="text-white/60">{item.sizeLabel} · Size</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-white">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
                      <Link href={`/products/${item.productId}`} className="hover:text-white">
                        Ver produto · View product
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white hover:text-white"
                      >
                        Remover · Remove
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
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Resumo conceitual · Concept summary</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (23%) · VAT</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envio premium · Shipping</span>
                <span>{shipping ? formatCurrency(shipping) : 'Incluído / Included'}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">Total simulado · Simulated total</span>
              <span className="text-2xl font-semibold text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          <p className="text-sm text-white/60">
            O fluxo não processa pagamentos reais. Ideal para narrar etapas de compra e mostrar consistência visual. /
            This flow does not process real payments; it exists to narrate the commerce experience for your portfolio.
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
              Ir para o checkout · Go to checkout
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/20 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white"
            >
              Continuar a explorar · Keep exploring
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
