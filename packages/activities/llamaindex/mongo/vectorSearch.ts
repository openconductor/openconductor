import { ApplicationFailure } from '@temporalio/activity';
import { MongoDBAtlasVectorSearch, serviceContextFromDefaults, VectorStoreIndex, OpenAI } from 'llamaindex';
import { MongoClient } from 'mongodb';

export const CHUNK_SIZE = 512;
export const CHUNK_OVERLAP = 20;

export async function mongoVectorSearch({}: {}): Promise<VectorStoreIndex> {
  const llm = new OpenAI({
    model: (process.env.MODEL as any) ?? 'gpt-3.5-turbo',
    maxTokens: 512,
  });

  const client = new MongoClient(process.env.MONGO_URI!);
  const serviceContext = serviceContextFromDefaults({
    llm,
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  const vectorStore = new MongoDBAtlasVectorSearch({
    mongodbClient: client,
    dbName: process.env.MONGODB_DATABASE!,
    collectionName: process.env.MONGODB_VECTORS!,
    indexName: process.env.MONGODB_VECTOR_INDEX,
  });

  const index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContext);

  if (!index) {
    throw ApplicationFailure.nonRetryable(`Storage context enpty`);
  }
  return index;
}
