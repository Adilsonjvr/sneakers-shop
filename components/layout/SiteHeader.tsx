"use client";

import Link from 'next/link';
import type { Route } from 'next';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

const HOME_ROUTE = '/' as Route;
const BAG_ROUTE = '/bag' as Route;
const ACCOUNT_ROUTE = '/account' as Route;

const copy = {
  pt: {
    bag: 'Sacola',
    account: 'Conta',
  },
  en: {
    bag: 'Bag',
    account: 'Account',
  },
};

export function SiteHeader() {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <Link
          href={HOME_ROUTE}
          className="font-display text-lg font-semibold tracking-[0.25em] uppercase text-white sm:text-xl"
        >
          AIR // LAB
        </Link>
        <LanguageSwitcher />
        <div className="ml-auto flex items-center gap-2">
          <HeaderIconButton href={BAG_ROUTE} label={t.bag}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path d="M6 8h12l-1 11H7z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </HeaderIconButton>
          <HeaderIconButton href={ACCOUNT_ROUTE} label={t.account}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
          </HeaderIconButton>
        </div>
      </div>
    </header>
  );
}

type HeaderIconButtonProps = {
  href: Route;
  label: string;
  children: React.ReactNode;
};

function HeaderIconButton({ href, label, children }: HeaderIconButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/70 transition hover:border-white hover:text-white"
      aria-label={label}
      title={label}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40">
        {children}
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.25em] hidden sm:inline">{label}</span>
    </Link>
  );
}
