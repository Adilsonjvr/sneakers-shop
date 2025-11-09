import Image from 'next/image';
import clsx from 'clsx';

export type ProductHeroImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
};

export function ProductHeroImage({ src, alt, className, overlay }: ProductHeroImageProps) {
  return (
    <div
      className={clsx(
        'relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-brand/5 to-black/80',
        'shadow-[0_25px_45px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      <div className="absolute inset-0 border border-white/5" />
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain mix-blend-multiply contrast-[1.15] saturate-[1.1]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-brand/20 to-black" />
      )}
      {overlay}
    </div>
  );
}
