'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type DropQueueJoinerProps = {
  dropId: string;
};

type QueueResponse = {
  ticketId: string;
  status: string;
  position: number | null;
  estimatedWaitMinutes: number | null;
};

export function DropQueueJoiner({ dropId }: DropQueueJoinerProps) {
  const fingerprint = useMemo(() => crypto.randomUUID(), []);

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
        throw new Error(payload.error || 'Falha ao entrar na fila');
      }

      const payload = await response.json();
      setStatus({
        ticketId: payload.ticketId,
        status: payload.status,
        position: payload.position,
        estimatedWaitMinutes: payload.estimatedWaitMinutes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border border-brand/40 bg-brand/10 p-5"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Drop Live · Queue</p>
      <p className="text-sm text-white/80">
        Reserva o teu lugar na fila / Save your spot in line. Receberás notificação quando o checkout abrir / You&apos;ll
        be notified when checkout opens.
      </p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Nome / Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none focus:border-white/40"
        />
        <input
          type="email"
          placeholder="Email"
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
          {loading ? 'A validar... / Validating' : 'Entrar / Join'}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {status && (
        <p className="mt-3 text-sm text-white/70">
          Ticket #{status.ticketId.slice(0, 6)} — {status.status}
          {status.position && ` · posição ${status.position} / position ${status.position}`}
          {status.estimatedWaitMinutes && ` (~${status.estimatedWaitMinutes} min)`}
        </p>
      )}
    </motion.div>
  );
}
