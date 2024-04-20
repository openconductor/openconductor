import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PrismaVectorStore } from 'langchain/vectorstores';
import { prisma } from '@openconductor/db';
import { Prisma } from '@openconductor/db/types';

export async function langchainVectorStoreSearch({
  query,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  query: string;
  openAIApiKey?: string;
}) {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorStore = new PrismaVectorStore(embeddings, {
    db: prisma,
    prisma: Prisma,
    tableName: 'Document',
    vectorColumnName: 'vector',
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });

  const results = vectorStore.similaritySearch(query, 2);

  return results;
}
