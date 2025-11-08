"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useSearchParams } from 'next/navigation';

const HOME_ROUTE = '/' as Route;

const navLinks: Array<{ label: string; mode?: 'drop' | 'collector' }> = [
  { label: 'Showroom' },
  { label: 'Drops', mode: 'drop' },
  { label: 'Colecionador', mode: 'collector' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMode = searchParams.get('mode');

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={HOME_ROUTE}
          className="font-display text-xl font-semibold tracking-[0.3em] uppercase"
        >
          AIR // LAB
        </Link>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.2em] text-white/60">
          {navLinks.map((link) => {
            const isActive =
              pathname === '/' && (link.mode ? activeMode === link.mode : !activeMode);
            const href = link.mode
              ? { pathname: HOME_ROUTE, query: { mode: link.mode } }
              : HOME_ROUTE;
            return (
              <Link
                key={link.label}
                href={href}
                className={`transition hover:text-white ${isActive ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          PT · EUR
        </div>
      </div>
    </header>
  );
}
