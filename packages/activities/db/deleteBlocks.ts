import { prisma } from '@openconductor/db';

export async function deleteDbBlocks({ agentId }: { agentId: string }) {
  return prisma.block.deleteMany({
    where: {
      agentId: agentId,
    },
  });
}
