import { AiAgentType, prisma } from '@openconductor/db';

export async function getDbAiAgent({ aiAgentId }: { aiAgentId?: string }) {
  return prisma.aiAgent.findFirstOrThrow({
    where: {
      id: aiAgentId,
    },
  });
}

export async function getDbAiAgents({ teamId, type }: { teamId: string; type?: AiAgentType }) {
  return prisma.aiAgent.findMany({
    where: {
      teamId,
      type,
      enabled: true,
    },
  });
}
