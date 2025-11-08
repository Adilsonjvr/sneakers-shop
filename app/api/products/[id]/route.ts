import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { fetchProductById } from '@/lib/products';

const paramsSchema = z.object({
  id: z.string().cuid(),
});

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const parsed = paramsSchema.safeParse(context.params);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid product identifier',
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const product = await fetchProductById(parsed.data.id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
