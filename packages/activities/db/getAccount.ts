import { prisma } from '@openconductor/db';

export async function getDbAccount({
  accountId,
  userId,
  provider,
}: {
  accountId?: string;
  userId?: string;
  provider?: string;
}) {
  return prisma.account.findFirstOrThrow({
    where: {
      id: accountId,
      userId,
      provider,
    },
  });
}
