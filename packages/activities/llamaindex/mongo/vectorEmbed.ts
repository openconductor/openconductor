import { Message } from '@openconductor/db';
import { MongoDBAtlasVectorSearch, VectorStoreIndex, Document, storageContextFromDefaults } from 'llamaindex';
import { MongoClient } from 'mongodb';

export async function mongoVectorEmbed({ message }: { message: Message }): Promise<boolean> {
  const client = new MongoClient(process.env.MONGO_URI!);
  const vectorStore = new MongoDBAtlasVectorSearch({
    mongodbClient: client,
    dbName: process.env.MONGODB_DATABASE!,
    collectionName: process.env.MONGODB_VECTORS!,
    indexName: process.env.MONGODB_VECTOR_INDEX,
  });

  const storageContext = await storageContextFromDefaults({ vectorStore });

  const document = new Document({ text: message.body, metadata: { messageId: message.id } });

  await VectorStoreIndex.fromDocuments([document], { storageContext });
  console.log(`Successfully created embeddings in the MongoDB collection ${process.env.MONGODB_VECTORS}.`);
  await client.close();
  return true;
}
