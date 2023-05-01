import { prisma } from '@openconductor/db';

export async function getDbAccount({ accountId }: { accountId: string }) {
  return prisma.account.findUniqueOrThrow({
    where: {
      id: accountId,
    },
  });
}
