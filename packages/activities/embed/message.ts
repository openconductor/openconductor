import { pipeline } from '@xenova/transformers';
import { prisma } from '@openconductor/db';

export async function embedMessage({ messageId }: { messageId?: string }) {
  const message = await prisma.message.findFirstOrThrow({
    where: {
      id: messageId,
    },
  });

  const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

  const output = await generateEmbedding(message.body, {
    pooling: 'mean',
    normalize: true,
  });

  const embedding = Array.from(output.data);

  const updatedMessage = await prisma.$executeRawUnsafe(
    `UPDATE "Message" SET embedding = $1 WHERE id = $2;`,
    embedding,
    messageId,
  );

  return {
    updatedMessage,
    embedding,
  };
}
