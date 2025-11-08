'use client';

import Link from 'next/link';

import { ProductResponse } from '@/lib/products';

type ColorwaySwitcherProps = {
  options: ProductResponse[];
  currentId: string;
};

export function ColorwaySwitcher({ options, currentId }: ColorwaySwitcherProps) {
  if (!options.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Outras colorways</p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <Link
            key={option.id}
            href={`/products/${option.id}`}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              option.id === currentId
                ? 'border-white bg-white text-black'
                : 'border-white/20 text-white/70 hover:border-white/60 hover:text-white'
            }`}
          >
            {option.colorway}
          </Link>
        ))}
      </div>
    </div>
  );
}
