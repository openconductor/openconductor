import { Prisma, prisma } from '@openconductor/db';

export async function getDbMessage({ messageId }: { messageId?: string }) {
  return prisma.message.findFirstOrThrow({
    where: {
      id: messageId,
    },
  });
}

export async function getDbMessagesInclude<T extends Prisma.MessageInclude>({
  teamId,
  include,
}: {
  teamId: string;
  include: Prisma.Subset<T, Prisma.MessageInclude>;
}) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return prisma.message.findMany({
    where: {
      teamId,
      NOT: { state: 'CLOSED' },
      createdAt: {
        gte: threeMonthsAgo,
      },
    },
    include,
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });
}
