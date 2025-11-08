import type { z } from 'zod';

import { customerSchema } from '@/lib/validation/customer';

export type CustomerInput = z.infer<typeof customerSchema>;
