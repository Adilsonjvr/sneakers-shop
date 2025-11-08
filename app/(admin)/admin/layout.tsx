import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Route } from 'next';

import { AdminTopbar } from '@/components/admin/AdminTopbar';

const SESSION_KEY = 'admin-session';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const requiresAuth = Boolean(process.env.ADMIN_PASSCODE);
  const hasSession = cookies().get(SESSION_KEY)?.value === 'verified';

  if (requiresAuth && !hasSession) {
    redirect('/admin/login' as Route);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AdminTopbar showSignOut={requiresAuth} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
