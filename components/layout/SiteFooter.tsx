'use client';

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/70 py-10 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-8 px-4 sm:px-6">
        <div className="flex-1 min-w-[200px] space-y-3">
          <p className="font-display text-lg tracking-[0.3em] text-white">AIR // LAB</p>
          <p className="text-sm text-white/50">
            Premium drops, storytelling e dados para colecionadores de Air Jordans.
          </p>
        </div>
        <div className="flex flex-1 min-w-[160px] flex-col gap-2 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Experiência</p>
          <Link href="/" className="transition hover:text-white">
            Showroom
          </Link>
          <Link href="/?mode=drop" className="transition hover:text-white">
            Drops
          </Link>
          <Link href="/?mode=collector" className="transition hover:text-white">
            Collector mode
          </Link>
        </div>
        <div className="flex flex-1 min-w-[200px] flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Social</p>
          <div className="flex gap-3">
            <SocialLink href="https://instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" />
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com" label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                <path d="M4 19L16.5 6M9 5h9v9" />
              </svg>
            </SocialLink>
            <SocialLink href="https://youtube.com" label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                <path d="M4 7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z" />
                <path d="M10 9l5 3-5 3z" />
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Air Lab · Projeto conceitual para portfólio.
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white hover:text-white"
      aria-label={label}
    >
      {children}
    </a>
  );
}
