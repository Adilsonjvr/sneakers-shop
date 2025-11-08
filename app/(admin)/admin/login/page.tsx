import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  const passcodeConfigured = Boolean(process.env.ADMIN_PASSCODE);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-10 text-white">
      <AdminLoginForm passcodeConfigured={passcodeConfigured} />
    </div>
  );
}
