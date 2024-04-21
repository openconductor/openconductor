import { prisma } from '@openconductor/db';
import { ApplicationFailure } from '@temporalio/activity';
import {
  MongoDBAtlasVectorSearch,
  serviceContextFromDefaults,
  OpenAI,
  VectorStoreQueryMode,
  VectorStoreQueryResult,
} from 'llamaindex';
import { MongoClient } from 'mongodb';

export const CHUNK_SIZE = 512;
export const CHUNK_OVERLAP = 20;

export async function mongoVectorSearch({ messageId }: { messageId: string }): Promise<VectorStoreQueryResult> {
  const { embedding } = await prisma.message.findFirstOrThrow({
    where: {
      id: messageId,
    },
  });

  const client = new MongoClient(process.env.MONGO_URI!);

  const vectorStore = new MongoDBAtlasVectorSearch({
    mongodbClient: client,
    dbName: process.env.MONGODB_DATABASE!,
    collectionName: process.env.MONGODB_VECTORS!,
    indexName: process.env.MONGODB_VECTOR_INDEX,
  });

  if (embedding) {
    const similarMessages = await vectorStore.query({
      //@ts-ignore
      queryEmbedding: [embedding],
      similarityTopK: 10,
      mode: VectorStoreQueryMode.DEFAULT,
    });

    return similarMessages;
  }
}
