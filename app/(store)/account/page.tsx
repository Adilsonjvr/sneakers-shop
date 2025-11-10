'use client';

import { useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';

const mockOrders = [
  { id: 'DROP-239', model: 'AJ1 Retro High OG', status: { pt: 'Em preparação', en: 'In preparation' }, date: '12 Out 2024' },
  { id: 'DROP-201', model: 'AJ4 Military Black', status: { pt: 'Entregue', en: 'Delivered' }, date: '02 Set 2024' },
];

const mockWishlist = ['AJ1 Hyper Royal', 'AJ11 Jubilee 25th', 'AJ4 Thunder Red'];

export default function AccountPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { lang } = useLanguage();
  const isPt = lang === 'pt';

  return (
    <div className="space-y-8">
      <header className="glass-panel space-y-3 border border-white/10 bg-black/50 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">
          {isPt ? 'Área de colecionador' : 'Collector hub'}
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white">
              {isPt ? 'Conta & fidelidade' : 'Account & loyalty'}
            </h1>
            <p className="text-white/60">
              {isPt
                ? 'Gestão de entregas, desejos e níveis de colecionador. Login opcional para storytelling.'
                : 'Manage deliveries, wishlist, and collector stats. Optional login for storytelling.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthenticated((prev) => !prev)}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white"
          >
            {isAuthenticated ? (isPt ? 'Simular logout' : 'Simulate logout') : isPt ? 'Simular login' : 'Simulate login'}
          </button>
        </div>
      </header>

      {!isAuthenticated ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">{isPt ? 'Entrar' : 'Sign in'}</p>
          <p className="mt-2 text-white/70">
            {isPt
              ? 'Formulário apenas demonstrativo. Nenhuma credencial é validada.'
              : 'Demo-only form. No credentials are validated.'}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-white/70">
              Email
              <input
                type="email"
                placeholder="colecionador@airlab.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-1 text-sm text-white/70">
              {isPt ? 'Password' : 'Password'}
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthenticated(true)}
            className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80"
          >
            {isPt ? 'Entrar no protótipo' : 'Enter demo'}
          </button>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">{isPt ? 'Perfil' : 'Profile'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Isabel Santos</h2>
            <p className="text-white/60">{isPt ? 'Membro desde 2018 · Lisboa' : 'Member since 2018 · Lisbon'}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center text-white">
              <div className="rounded-2xl bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{isPt ? 'Pares' : 'Pairs'}</p>
                <p className="text-2xl font-semibold">37</p>
              </div>
              <div className="rounded-2xl bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{isPt ? 'Nível' : 'Tier'}</p>
                <p className="text-2xl font-semibold">Platinum</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              {isPt ? 'Pedidos recentes' : 'Recent orders'}
            </p>
            <div className="mt-4 space-y-3">
              {mockOrders.map((order) => (
                <article
                  key={order.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">{order.id}</p>
                    <p className="text-lg font-semibold text-white">{order.model}</p>
                  </div>
                  <div className="text-right text-white/70">
                    <p>{order.status[lang]}</p>
                    <p className="text-sm text-white/40">{order.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              {isPt ? 'Wishlist' : 'Wishlist'}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {mockWishlist.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              {isPt ? 'Preferências' : 'Preferences'}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                <input type="checkbox" defaultChecked className="accent-brand" />{' '}
                {isPt ? 'Alertas de drop exclusivos' : 'Exclusive drop alerts'}
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                <input type="checkbox" className="accent-brand" /> {isPt ? 'Sugestões de tamanho' : 'Size suggestions'}
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                <input type="checkbox" defaultChecked className="accent-brand" />{' '}
                {isPt ? 'Newsletter colecionador' : 'Collector newsletter'}
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                <input type="checkbox" className="accent-brand" />{' '}
                {isPt ? 'Partilhar atividade com amigos' : 'Share activity with friends'}
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
