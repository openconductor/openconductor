import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const messageSchema = z.object({
  id: z.string(),
  key: z.string(),
  source: z.string(),
  title: z.string(),
  body: z.string(),
  url: z.string(),
  createdAt: z.date(),
  author: z.object({
    id: z.string(),
    type: z.string(),
    typeId: z.string(),
    imageUrl: z.string(),
    handle: z.string(),
    url: z.string(),
  }),
  status: z.string(),
  labels: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.date(),
      color: z.string(),
    }),
  ),
  summary: z.string(),
  priority: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
