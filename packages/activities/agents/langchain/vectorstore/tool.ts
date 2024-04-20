import { prisma } from '@openconductor/db';
import { Prisma } from '@openconductor/db/types';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PrismaVectorStore } from 'langchain/vectorstores';
import { VectorStoreQATool } from 'langchain/tools';
import { createVectorStoreAgent } from 'langchain/agents';

export async function langchainVectorStoreTool({
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

  const model = new OpenAI({ temperature: 0, openAIApiKey });

  // const chain = VectorDBQAChain.fromLLM(model, vectorStore);

  const toolkit = new VectorStoreQATool(query, `agent for ${query}`, {
    vectorStore,
    llm: model,
  });

  // const toolkit = new VectorStoreToolkit(toolkit, model);

  // createVectorStoreAgent(model,toolkit)

  return toolkit;
}
