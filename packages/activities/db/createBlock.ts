import { prisma } from '@openconductor/db';

export async function createDbBlock({
  agentId,
  userId,
  name,
  order,
  input,
}: {
  agentId: string;
  userId: string;
  name: string;
  order: number;
  input: string;
}) {
  return prisma.block.create({
    data: {
      agent: {
        connect: { id: agentId },
      },
      name,
      order,
      input,
      creator: {
        connect: { id: userId },
      },
    },
  });
}
