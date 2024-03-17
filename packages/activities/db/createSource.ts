import { Prisma, prisma } from '@openconductor/db';

export async function createDbSource(data: Omit<Prisma.SourceCreateInput, 'id'>) {
  return prisma.source.upsert({
    where: {
      type_sourceId: {
        type: data.type,
        sourceId: data.sourceId,
      },
    },
    update: data,
    create: data,
  });
}
