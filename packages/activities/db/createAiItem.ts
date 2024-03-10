import { Prisma, prisma } from '@openconductor/db';

export async function createAiItem(data: Omit<Prisma.AiItemCreateInput, 'id'>) {
  return prisma.aiItem.upsert({
    where: {
      type_messageId: {
        type: data.type,
        messageId: data.message?.connect?.id ?? '',
      },
    },
    update: data,
    create: data,
  });
}
