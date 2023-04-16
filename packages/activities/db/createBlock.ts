import { prisma } from '@openconductor/db';

export async function createDbBlock({
  workflowId,
  userId,
  name,
  order,
  input,
}: {
  workflowId: string;
  userId: string;
  name: string;
  order: number;
  input: string;
}) {
  return prisma.block.create({
    data: {
      workflow: {
        connect: { id: workflowId },
      },
      name,
      order,
      input,
      creator: {
        connect: { id: userId },
      },
      agent: {
        connect: { id: 'clgi388yh000gqh0btfawl75t' },
      },
    },
  });
}
