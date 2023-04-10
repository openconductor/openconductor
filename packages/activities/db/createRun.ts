import { prisma } from '@openconductor/db';

export async function createDbRun(workflowId: string, temporalId: string, userId: string) {
  return prisma.run.create({
    data: {
      startedAt: new Date(),
      endedAt: new Date(),
      workflow: {
        connect: { id: workflowId },
      },
      status: 'pending',
      temporalId,
      creator: {
        connect: { id: userId },
      },
    },
  });
}
