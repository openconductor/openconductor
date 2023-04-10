import { Agents } from '@openconductor/db/types';
import { z } from 'zod';

export const updateAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(Agents),
  integrationId: z.string(),
  systemTemplate: z.string(),
  promptTemplate: z.string(),
});
