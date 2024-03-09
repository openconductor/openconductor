import { Prisma, prisma } from '@openconductor/db';

export async function createDbMessage(data: Omit<Prisma.MessageCreateInput, 'id'>) {
  return prisma.message.upsert({
    where: {
      source_sourceId: {
        source: data.source,
        sourceId: data.sourceId,
      },
    },
    update: data,
    create: data,
  });
}
