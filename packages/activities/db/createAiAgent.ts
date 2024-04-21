import { Prisma, prisma } from '@openconductor/db';

export async function createDbAiAgent(data: Omit<Prisma.AiAgentCreateInput, 'id'>) {
  return prisma.aiAgent.upsert({
    where: {
      type_aiAgentId: {
        type: data.type,
        aiAgentId: data.aiAgentId,
      },
    },
    update: data,
    create: data,
  });
}
