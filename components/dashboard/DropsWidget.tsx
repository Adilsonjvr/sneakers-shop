'use client';

import { formatDate } from '@/lib/utils/format';

type DropsWidgetProps = {
  drops: {
    id: string;
    productName: string;
    startAt: string;
    endAt: string | null;
    status: 'upcoming' | 'live' | 'ended';
  }[];
};

const statusCopy: Record<DropsWidgetProps['drops'][number]['status'], string> = {
  live: 'Ativo',
  upcoming: 'Agendado',
  ended: 'Encerrado',
};

const statusColors = {
  live: 'bg-emerald-500/20 text-emerald-300',
  upcoming: 'bg-amber-500/20 text-amber-200',
  ended: 'bg-white/10 text-white/60',
};

export function DropsWidget({ drops }: DropsWidgetProps) {
  return (
    <div className="glass-panel space-y-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Drops</p>
        <h3 className="text-2xl font-semibold text-white">Fila e calendário</h3>
      </div>
      <div className="space-y-3">
        {drops.map((drop) => (
          <div key={drop.id} className="rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-white">{drop.productName}</p>
              <span className={`rounded-full px-3 py-1 text-xs ${statusColors[drop.status]}`}>
                {statusCopy[drop.status]}
              </span>
            </div>
            <p className="text-sm text-white/60">
              {drop.status === 'upcoming'
                ? `Inicia ${formatDate(drop.startAt)}`
                : drop.status === 'live'
                ? `Termina ${drop.endAt ? formatDate(drop.endAt) : 'em breve'}`
                : `Terminou ${drop.endAt ? formatDate(drop.endAt) : ''}`}
            </p>
          </div>
        ))}
        {drops.length === 0 && (
          <p className="text-center text-sm text-white/50">Nenhum drop registado.</p>
        )}
      </div>
    </div>
  );
}
