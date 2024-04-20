import { SourceType, prisma } from '@openconductor/db';

export async function getDbSource({ sourceId }: { sourceId?: string }) {
  return prisma.source.findFirstOrThrow({
    where: {
      id: sourceId,
    },
  });
}

export async function getDbSources({ teamId, type }: { teamId: string; type?: SourceType }) {
  return prisma.source.findMany({
    where: {
      teamId,
      type,
    },
  });
}
