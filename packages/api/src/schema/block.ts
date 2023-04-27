import { z } from 'zod';

export const updateBlockSchema = z.object({
  blockId: z.string().min(1),
  input: z.string().optional(),
  name: z.string().optional(),
  order: z.number().optional(),
});
