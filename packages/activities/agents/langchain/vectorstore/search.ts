import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { prisma } from '@openconductor/db';
import { Prisma } from '@openconductor/db/types';

export async function langchainVectorStoreSearch({
  query,
  k = 4,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  query: string;
  k?: number;
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

  const results = vectorStore.similaritySearch(query, k);

  return results;
}
