'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils/format';

const paymentMethods = [
  {
    id: 'card',
    label: 'Cartão de crédito',
    description: 'Visa, Mastercard, Amex · Suporte a 3DS',
    badge: '💳',
  },
  {
    id: 'mbway',
    label: 'MB Way',
    description: 'Pagamento instantâneo mobile em Portugal',
    badge: '📱',
  },
  {
    id: 'klarna',
    label: 'Klarna',
    description: 'Paga em 3x sem juros · ideal para colecionadores',
    badge: '🕒',
  },
];

const SHIPPING_FLAT = 15;
const VAT_RATE = 0.23;

export default function CheckoutPage() {
  const { items } = useCart();
  const [method, setMethod] = useState(paymentMethods[0].id);
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const vat = subtotal * VAT_RATE;
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + vat + shipping;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Fluxo meramente conceitual — nenhum pagamento foi processado.');
  };

  return (
    <div className="space-y-8">
      <header className="glass-panel space-y-3 border border-white/10 bg-black/50 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Checkout conceptual</p>
        <h1 className="font-display text-4xl font-semibold text-white">Simulação Stripe-ready</h1>
        <p className="text-white/60">
          Estrutura preparada para SCA/3DS, mas desconectada da API nesta fase de portfolio. Use para demonstrar
          fluxos de compra premium.
        </p>
      </header>

      <form
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Dados pessoais</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-white/70">
                Nome completo
                <input
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="Michael Jordan"
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-white/70">
                Email
                <input
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="mj@flightclub.com"
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-white/70">
                Telefone
                <input
                  type="tel"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="+351 900 000 000"
                />
              </label>
              <label className="space-y-1 text-sm text-white/70">
                NIF
                <input
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="000000000"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Endereço & envio</p>
            <div className="mt-4 grid gap-4">
              <label className="space-y-1 text-sm text-white/70">
                Morada
                <input
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="Rua Air Max, 23"
                  required
                />
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-1 text-sm text-white/70">
                  Código Postal
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    placeholder="1000-100"
                    required
                  />
                </label>
                <label className="space-y-1 text-sm text-white/70">
                  Cidade
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    placeholder="Lisboa"
                    required
                  />
                </label>
                <label className="space-y-1 text-sm text-white/70">
                  País
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    defaultValue="Portugal"
                  >
                    <option>Portugal</option>
                    <option>Espanha</option>
                    <option>França</option>
                    <option>Alemanha</option>
                  </select>
                </label>
              </div>
              <label className="space-y-1 text-sm text-white/70">
                Notas de entrega
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  rows={3}
                  placeholder="Deixar na portaria, exclusivo colecionador."
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Pagamento</p>
            <div className="mt-4 grid gap-3">
              {paymentMethods.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 transition ${
                    method === option.id ? 'border-white bg-white/10' : 'border-white/10 bg-black/30 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={method === option.id}
                    onChange={() => setMethod(option.id)}
                    className="hidden"
                  />
                  <span className="text-2xl">{option.badge}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{option.label}</p>
                    <p className="text-xs text-white/60">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-white/70">
                Número do cartão
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9 ]*"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                  placeholder="4242 4242 4242 4242"
                />
              </label>
              <div className="grid gap-4 grid-cols-2">
                <label className="space-y-1 text-sm text-white/70">
                  Expira
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    placeholder="12/28"
                  />
                </label>
                <label className="space-y-1 text-sm text-white/70">
                  CVC
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    placeholder="123"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Resumo da ordem</p>
            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-white/60">
                  Nenhum item na sacola. Volte para o showroom para adicionar pares.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-white/80">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-white/50">{item.sizeLabel}</p>
                    </div>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envio</span>
              <span>{shipping ? formatCurrency(shipping) : 'Incluído'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-white">
            <span className="text-xs uppercase tracking-[0.4em]">Total</span>
            <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!items.length}
          >
            Simular pagamento
          </button>
          <div className="text-xs text-white/50">
            Ao clicar em “Simular pagamento” nenhum dado é enviado a gateways externos. Use para apresentações,
            estudos de caso e storytelling de produto.
          </div>
          <Link
            href="/bag"
            className="inline-flex w-full justify-center rounded-2xl border border-white/20 px-4 py-3 text-center text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white"
          >
            Voltar à sacola
          </Link>
        </aside>
      </form>
    </div>
  );
}
