import { prisma } from '@openconductor/db';

export async function getDbWorkflow({ workflowId }: { workflowId: string }) {
  return prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId,
    },
    include: {
      blocks: true,
    },
  });
}
