'use client';

import { motion } from 'framer-motion';

import { TrendSparkline } from '@/components/dashboard/TrendSparkline';

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trendLabel?: string;
  trendPositive?: boolean;
  sparkline?: number[];
};

export function KpiCard({
  title,
  value,
  subtitle,
  trendLabel,
  trendPositive = true,
  sparkline,
}: KpiCardProps) {
  return (
    <motion.div
      layout
      className="glass-panel flex flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{title}</p>
          <p className="text-3xl font-semibold text-white">{value}</p>
          {subtitle && <p className="text-white/50">{subtitle}</p>}
        </div>
        {trendLabel && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              trendPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}
          >
            {trendLabel}
          </span>
        )}
      </div>
      {sparkline && sparkline.length > 0 && <TrendSparkline points={sparkline} />}
    </motion.div>
  );
}
