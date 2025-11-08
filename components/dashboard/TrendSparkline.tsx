'use client';

import { motion } from 'framer-motion';

export function TrendSparkline({ points }: { points: number[] }) {
  const max = points.length ? Math.max(...points) : 1;

  return (
    <div className="flex h-16 items-end gap-1">
      {points.map((value, index) => {
        const height = max === 0 ? 0 : (value / max) * 100;
        return (
          <motion.span
            key={`spark-${index}`}
            layout
            className="flex-1 rounded-full bg-white/30"
            style={{ height: `${height}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        );
      })}
    </div>
  );
}
