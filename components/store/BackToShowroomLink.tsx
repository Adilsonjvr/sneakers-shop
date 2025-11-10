'use client';

import Link from 'next/link';
import type { Route } from 'next';

import { useLanguage } from '@/components/i18n/LanguageProvider';

export function BackToShowroomLink({ href }: { href: Route }) {
  const { lang } = useLanguage();
  return (
    <Link
      href={href}
      className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
    >
      {lang === 'pt' ? '← voltar ao showroom' : '← back to showroom'}
    </Link>
  );
}
