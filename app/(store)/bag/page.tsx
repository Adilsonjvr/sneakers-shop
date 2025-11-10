'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils/format';

const SHIPPING_FLAT = 15;
const VAT_RATE = 0.23;

const copy = {
  pt: {
    tag: 'Sneaker sacola',
    title: 'Seleção curada',
    description: 'Itens adicionados via showroom aparecem aqui antes do checkout conceitual.',
    count: 'Itens',
    sectionTitle: 'Itens na sacola',
    sectionSubtitle: 'Fluxo de apresentação',
    empty: 'A sacola está vazia. Usa o quick-add para testar a experiência.',
    colorway: 'Colorway',
    size: 'Tamanho',
    view: 'Ver produto',
    remove: 'Remover',
    summary: 'Resumo',
    vat: 'IVA (23%)',
    shipping: 'Envio premium',
    included: 'Incluído',
    total: 'Total simulado',
    info: 'Fluxo fictício — nenhum pagamento real é processado.',
    checkout: 'Ir para o checkout',
    explore: 'Continuar a explorar',
  },
  en: {
    tag: 'Sneaker bag',
    title: 'Curated selection',
    description: 'Items added from the showroom land here before the concept checkout.',
    count: 'Items',
    sectionTitle: 'Items in bag',
    sectionSubtitle: 'Presentation flow',
    empty: 'Your bag is empty. Use quick-add to try the experience.',
    colorway: 'Colorway',
    size: 'Size',
    view: 'View product',
    remove: 'Remove',
    summary: 'Summary',
    vat: 'VAT (23%)',
    shipping: 'Premium shipping',
    included: 'Included',
    total: 'Simulated total',
    info: 'Concept-only flow — no real payment is processed.',
    checkout: 'Go to checkout',
    explore: 'Keep exploring',
  },
};

export default function BagPage() {
  const { items, removeItem } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const vat = subtotal * VAT_RATE;
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + vat + shipping;
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <div className="space-y-8">
      <header className="glass-panel space-y-3 border border-white/10 bg-black/50 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">{t.tag}</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white">{t.title}</h1>
            <p className="text-white/60">{t.description}</p>
          </div>
          <div className="text-right text-white/70">
            <p className="text-xs uppercase tracking-[0.4em]">{t.count}</p>
            <p className="text-3xl font-semibold">{items.length.toString().padStart(2, '0')}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
            <span>{t.sectionTitle}</span>
            <span>{t.sectionSubtitle}</span>
          </header>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-white/60">
              {t.empty}
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
                        {t.colorway}: {item.colorway}
                      </p>
                      <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                      <p className="text-white/60">
                        {t.size}: {item.sizeLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-white">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
                      <Link href={`/products/${item.productId}`} className="hover:text-white">
                        {t.view}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white hover:text-white"
                      >
                        {t.remove}
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
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">{t.summary}</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.vat}</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span>{shipping ? formatCurrency(shipping) : t.included}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">{t.total}</span>
              <span className="text-2xl font-semibold text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          <p className="text-sm text-white/60">{t.info}</p>
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
              {t.checkout}
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/20 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white"
            >
              {t.explore}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
