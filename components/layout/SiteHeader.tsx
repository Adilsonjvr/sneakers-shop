"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Showroom' },
  { href: '/?mode=drop', label: 'Drops' },
  { href: '/?mode=collector', label: 'Colecionador' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-[0.3em] uppercase">
          AIR // LAB
        </Link>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.2em] text-white/60">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-white ${
                pathname === link.href ? 'text-white' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          PT · EUR
        </div>
      </div>
    </header>
  );
}
