import { ModelLine } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { fetchProducts } from '@/lib/products';

const listQuerySchema = z.object({
  mode: z.enum(['showroom', 'drop', 'collector']).optional(),
  limit: z.coerce.number().int().min(1).max(60).default(12),
  cursor: z.string().cuid().optional(),
  search: z
    .string()
    .min(2)
    .max(120)
    .optional(),
  modelLine: z.nativeEnum(ModelLine).optional(),
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const parsed = listQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const { mode, limit, cursor, search, modelLine } = parsed.data;

  const payload = await fetchProducts({
    mode,
    limit,
    cursor,
    search,
    modelLine,
  });

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
