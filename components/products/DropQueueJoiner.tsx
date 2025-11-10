'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { useLanguage } from '@/components/i18n/LanguageProvider';

type DropQueueJoinerProps = {
  dropId: string;
};

type QueueResponse = {
  ticketId: string;
  status: string;
  position: number | null;
  estimatedWaitMinutes: number | null;
};

const copy = {
  pt: {
    title: 'Drop Live',
    description: 'Reserva o teu lugar na fila. Avisamos quando o checkout abrir.',
    namePlaceholder: 'Nome',
    emailPlaceholder: 'Email',
    cta: 'Entrar na fila',
    loading: 'A validar...',
    errorFallback: 'Erro inesperado',
  },
  en: {
    title: 'Drop Live',
    description: 'Save your spot in line. We will ping you when checkout opens.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    cta: 'Join queue',
    loading: 'Validating...',
    errorFallback: 'Unexpected error',
  },
};

export function DropQueueJoiner({ dropId }: DropQueueJoinerProps) {
  const fingerprint = useMemo(() => crypto.randomUUID(), []);
  const { lang } = useLanguage();
  const t = copy[lang];

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<QueueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const joinQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/drops/${dropId}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { email, name },
          fingerprint,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || t.errorFallback);
      }

      const payload = await response.json();
      setStatus({
        ticketId: payload.ticketId,
        status: payload.status,
        position: payload.position,
        estimatedWaitMinutes: payload.estimatedWaitMinutes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border border-brand/40 bg-brand/10 p-5"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">{t.title}</p>
      <p className="text-sm text-white/80">{t.description}</p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none focus:border-white/40"
        />
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none focus:border-white/40"
        />
        <button
          type="button"
          onClick={joinQueue}
          disabled={!email || loading}
          className="rounded-xl bg-brand px-4 py-2 font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t.loading : t.cta}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {status && (
        <p className="mt-3 text-sm text-white/70">
          Ticket #{status.ticketId.slice(0, 6)} — {status.status}
          {status.position && ` · #${status.position}`}
          {status.estimatedWaitMinutes && ` (~${status.estimatedWaitMinutes} min)`}
        </p>
      )}
    </motion.div>
  );
}
