import { prisma } from '@openconductor/db';
import { PrismaClientKnownRequestError } from '@openconductor/db/types/runtime/library';

type Similar = {
  id: string;
  title: string;
  similarity: number;
};

export async function searchByEmbedding({ embedding }: { embedding: number[] }) {
  try {
    const vectorQuery = `[${embedding.join(',')}]`;

    const similarMessages: Similar[] = await prisma.$queryRaw`
      SELECT
        id,
        "title",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM "Message"
      where 1 - (embedding <=> ${vectorQuery}::vector) > .9
      ORDER BY  similarity DESC
      LIMIT 3;
    `;

    return similarMessages;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Error during search by embedding:', error.message);
    }
    throw error;
  }
}
