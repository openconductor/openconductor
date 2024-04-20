import { pipeline } from '@xenova/transformers';
import { prisma } from '@openconductor/db';

export async function embedMessage({ messageId }: { messageId?: string }) {
  const message = await prisma.message.findFirstOrThrow({
    where: {
      id: messageId,
    },
  });

  const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

  // Generate a vector using Transformers.js
  const output = await generateEmbedding(message.body, {
    pooling: 'mean',
    normalize: true,
  });

  // Extract the embedding output
  const embedding = Array.from(output.data);

  // Store the vector in Postgres
  await prisma.$executeRawUnsafe(
    `UPDATE "Message" SET embedding = $1 WHERE id = $2;`,
    embedding, // Make sure this is formatted as expected by your database
    messageId,
  );
}
