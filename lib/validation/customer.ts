import { z } from 'zod';

export const customerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120).optional(),
  phone: z.string().min(6).max(32).optional(),
  vatNumber: z.string().max(20).optional(),
  marketingOptIn: z.boolean().optional(),
});
