"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useSearchParams } from 'next/navigation';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

const HOME_ROUTE = '/' as Route;
const BAG_ROUTE = '/bag' as Route;
const ACCOUNT_ROUTE = '/account' as Route;

const navLinks: Array<{ labelKey: 'showroom' | 'drops' | 'collector'; mode?: 'drop' | 'collector' }> = [
  { labelKey: 'showroom' },
  { labelKey: 'drops', mode: 'drop' },
  { labelKey: 'collector', mode: 'collector' },
];

const copy = {
  pt: {
    nav: {
      showroom: 'Showroom',
      drops: 'Drops',
      collector: 'Colecionador',
    },
    bag: 'Sacola',
    account: 'Conta',
  },
  en: {
    nav: {
      showroom: 'Showroom',
      drops: 'Releases',
      collector: 'Collector',
    },
    bag: 'Bag',
    account: 'Account',
  },
};

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMode = searchParams.get('mode');
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex flex-1 items-center gap-4">
          <Link
            href={HOME_ROUTE}
            className="font-display text-xl font-semibold tracking-[0.3em] uppercase text-white"
          >
            AIR // LAB
          </Link>
        </div>
        <nav className="flex flex-1 justify-center gap-6 text-sm uppercase tracking-[0.2em] text-white/60">
          {navLinks.map((link) => {
            const isActive =
              pathname === '/' && (link.mode ? activeMode === link.mode : !activeMode);
            const href = link.mode
              ? { pathname: HOME_ROUTE, query: { mode: link.mode } }
              : HOME_ROUTE;
            return (
              <Link
                key={link.labelKey}
                href={href}
                className={`transition hover:text-white ${isActive ? 'text-white' : ''}`}
              >
                {t.nav[link.labelKey]}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          <LanguageSwitcher />
          <Link href={BAG_ROUTE} className="transition hover:text-white">
            {t.bag}
          </Link>
          <Link href={ACCOUNT_ROUTE} className="transition hover:text-white">
            {t.account}
          </Link>
        </div>
      </div>
    </header>
  );
}
