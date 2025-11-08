import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_KEY = 'admin-session';

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json(
      { error: 'ADMIN_PASSCODE não configurado' },
      { status: 500 },
    );
  }

  const { passcode } = await request.json().catch(() => ({ passcode: undefined }));

  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 401 });
  }

  cookies().set({
    name: SESSION_KEY,
    value: 'verified',
    path: '/admin',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hora
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete(SESSION_KEY);
  return NextResponse.json({ ok: true });
}
