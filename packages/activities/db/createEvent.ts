import { prisma } from '@openconductor/db';

export async function createDbEvent({
  blockId,
  runId,
  status = 'started',
  output,
}: {
  blockId: string;
  runId: string;
  status?: string;
  output?: string;
}) {
  return prisma.event.create({
    data: {
      startedAt: new Date(),
      block: {
        connect: { id: blockId },
      },
      run: {
        connect: { id: runId },
      },
      status,
      output,
    },
  });
}
