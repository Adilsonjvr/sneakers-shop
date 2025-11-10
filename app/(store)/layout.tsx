import { Suspense } from 'react';

import { CartProvider } from '@/components/cart/CartProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}
