import { prisma } from '@openconductor/db';

export async function updateDbEvent(eventId: string, status: string, output?: string, tokens?: number) {
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      endedAt: new Date(),
      status,
      output,
      tokens,
    },
  });
}
