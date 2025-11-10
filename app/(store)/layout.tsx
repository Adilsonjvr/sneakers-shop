import { Suspense } from 'react';

import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import { CartProvider } from '@/components/cart/CartProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
            {children}
          </main>
          <SiteFooter />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
