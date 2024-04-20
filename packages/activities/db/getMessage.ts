import { prisma } from '@openconductor/db';

export async function getDbMessage({ messageId }: { messageId?: string }) {
  return prisma.message.findFirstOrThrow({
    where: {
      id: messageId,
    },
  });
}
