'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition } from 'react';

const navLinks = [{ href: '/admin/dashboard', label: 'Dashboard' }];

export function AdminTopbar({ showSignOut }: { showSignOut: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = () => {
    startTransition(async () => {
      setError(null);
      const response = await fetch('/api/admin/session', { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error ?? 'Erro ao terminar sessão');
        return;
      }
      router.push('/admin/login');
      router.refresh();
    });
  };

  return (
    <header className="border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Admin</p>
          <h1 className="font-display text-xl font-semibold">Sneaker Ops</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-white/60">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-white ${
                pathname.startsWith(link.href) ? 'text-white' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {showSignOut ? (
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/60 hover:text-white disabled:opacity-40"
            onClick={handleSignOut}
            disabled={pending}
          >
            Sair
          </button>
        ) : (
          <span className="text-sm text-white/60">Modo dev</span>
        )}
      </div>
      {error && (
        <div className="bg-red-600/20 px-6 py-2 text-center text-sm text-red-200">
          {error}
        </div>
      )}
    </header>
  );
}
