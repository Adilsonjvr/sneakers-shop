'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useRef, useState } from 'react';

type TiltedHeroProps = {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
};

export function TiltedHero({ src, alt, className, overlay }: TiltedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const percentX = (event.clientX - rect.left) / rect.width - 0.5;
    const percentY = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: percentX * 18,
      y: -percentY * 12,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-black/60',
        'transition-transform duration-200 will-change-transform',
        className,
      )}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2), transparent 55%)',
        }}
      />
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.45)]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      {overlay}
      <div className="pointer-events-none absolute left-4 bottom-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
        Arraste para girar
      </div>
    </div>
  );
}
