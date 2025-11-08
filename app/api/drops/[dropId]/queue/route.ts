import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { DomainError } from '@/lib/errors';
import { getQueueTicket, joinDropQueue } from '@/lib/services/dropQueue';
import { customerSchema } from '@/lib/validation/customer';

const paramsSchema = z.object({
  dropId: z.string().cuid(),
});

const joinPayloadSchema = z.object({
  customer: customerSchema,
  fingerprint: z.string().min(12).max(256).optional(),
});

const statusQuerySchema = z.object({
  ticketId: z.string().cuid(),
});

const getClientIp = (request: NextRequest) => {
  const header = request.headers.get('x-forwarded-for') ?? '';
  const [first] = header.split(',').map((value) => value.trim());
  return first || undefined;
};

export async function POST(request: NextRequest, context: { params: { dropId: string } }) {
  const params = paramsSchema.safeParse(context.params);
  if (!params.success) {
    return NextResponse.json({ error: 'Drop inválido' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = joinPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Payload inválido', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const ticket = await joinDropQueue({
      dropId: params.data.dropId,
      customer: parsed.data.customer,
      fingerprint: parsed.data.fingerprint,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('Erro ao entrar na fila do drop', error);
    return NextResponse.json({ error: 'Não foi possível entrar na fila' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: { dropId: string } }) {
  const params = paramsSchema.safeParse(context.params);
  if (!params.success) {
    return NextResponse.json({ error: 'Drop inválido' }, { status: 400 });
  }

  const url = new URL(request.url);
  const ticketId = url.searchParams.get('ticketId');

  const parsed = statusQuerySchema.safeParse({ ticketId });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'ticketId obrigatório', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const ticket = await getQueueTicket({
    dropId: params.data.dropId,
    ticketId: parsed.data.ticketId,
  });

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 });
  }

  return NextResponse.json(ticket);
}
