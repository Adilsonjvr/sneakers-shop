'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminLoginForm({ passcodeConfigured }: { passcodeConfigured: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Código inválido');
      }
      router.replace('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (!passcodeConfigured) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-lg font-semibold text-white">
          ADMIN_PASSCODE não definido — dashboard liberado em modo dev.
        </p>
        <p className="mt-2 text-white/60">
          Defina ADMIN_PASSCODE no .env para ativar RBAC básico.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel flex flex-col gap-4 p-8"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Acesso restrito</p>
        <h1 className="font-display text-3xl font-semibold text-white">Dashboard Admin</h1>
        <p className="text-white/60">Introduz o passcode fornecido pela equipa de operações.</p>
      </div>
      <input
        type="password"
        value={passcode}
        onChange={(event) => setPasscode(event.target.value)}
        placeholder="Passcode"
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/50"
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={!passcode || loading}
        className="rounded-2xl bg-white px-4 py-3 font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Validando...' : 'Entrar'}
      </button>
    </form>
  );
}
