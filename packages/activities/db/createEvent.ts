import { prisma } from '@openconductor/db';

export async function createDbEvent(blockId: string, runId: string) {
  return prisma.event.create({
    data: {
      startedAt: new Date(),
      block: {
        connect: { id: blockId },
      },
      run: {
        connect: { id: runId },
      },
      status: 'started',
    },
  });
}
