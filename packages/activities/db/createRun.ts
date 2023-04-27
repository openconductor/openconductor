import { prisma } from '@openconductor/db';

export async function createDbRun({
  agentId,
  temporalId,
  userId,
}: {
  agentId: string;
  temporalId: string;
  userId: string;
}) {
  return prisma.run.create({
    data: {
      startedAt: new Date(),
      endedAt: new Date(),
      agent: {
        connect: { id: agentId },
      },
      status: 'pending',
      temporalId,
      creator: {
        connect: { id: userId },
      },
    },
  });
}
