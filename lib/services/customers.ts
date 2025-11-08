import { Customer } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { CustomerInput } from '@/lib/types/customer';

export type PrismaTransactionClient = Parameters<
  typeof prisma.$transaction
>[0] extends (arg: infer P) => any
  ? P
  : never;

export async function upsertCustomer(
  tx: PrismaTransactionClient,
  input: CustomerInput,
): Promise<Customer> {
  return tx.customer.upsert({
    where: { email: input.email },
    create: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      vatNumber: input.vatNumber,
      marketingOptIn: Boolean(input.marketingOptIn),
    },
    update: {
      name: input.name ?? undefined,
      phone: input.phone ?? undefined,
      vatNumber: input.vatNumber ?? undefined,
      marketingOptIn:
        typeof input.marketingOptIn === 'boolean' ? input.marketingOptIn : undefined,
    },
  });
}
