import { prisma } from '@openconductor/db';

export async function getDbWorkflow(id: string) {
  return prisma.workflow.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      blocks: true,
    },
  });
}
