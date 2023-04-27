import { prisma } from '@openconductor/db';

export async function getDbAgent({ agentId }: { agentId: string }) {
  return prisma.agent.findUniqueOrThrow({
    where: {
      id: agentId,
    },
    include: {
      blocks: true,
    },
  });
}
