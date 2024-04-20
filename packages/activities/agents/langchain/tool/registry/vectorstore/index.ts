import { prisma } from '@openconductor/db';
import { Prisma } from '@openconductor/db/types';
import { CallbackManager, ConsoleCallbackHandler } from 'langchain/callbacks';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { ChainTool, Tool } from 'langchain/tools';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';

export function langchainVectorTool({ openAIApiKey = process.env.OPENAI_API_KEY }: { openAIApiKey?: string }): Tool {
  const callbackManager = new CallbackManager();
  callbackManager.addHandler(new ConsoleCallbackHandler());

  const model = new OpenAI({
    temperature: 0,
    openAIApiKey,
  });

  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorStore = new PrismaVectorStore(embeddings, {
    db: prisma,
    prisma: Prisma,
    tableName: 'Document',
    vectorColumnName: 'embedding',
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });

  const chain = VectorDBQAChain.fromLLM(model, vectorStore);

  const databaseTool: Tool = new ChainTool({
    name: 'database-Search',
    description: 'useful for when you need to answer questions about tools that can be found on github',
    chain: chain,
  });

  return databaseTool;
}
