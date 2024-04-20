import { Prisma, prisma } from '@openconductor/db';

export async function createDbMessage(data: Omit<Prisma.MessageCreateInput, 'id'>) {
  return prisma.message.upsert({
    where: {
      sourceId_sourceReferenceId: {
        sourceId: data.source.connect?.id ?? '',
        sourceReferenceId: data.sourceReferenceId,
      },
    },
    update: data,
    create: data,
  });
}
