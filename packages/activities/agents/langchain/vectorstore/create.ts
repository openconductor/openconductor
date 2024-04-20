import { prisma } from '@openconductor/db';
import { Document, Prisma } from '@openconductor/db/types';
import { Document as LangchainDocument } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PrismaVectorStore } from 'langchain/vectorstores';

export async function langchainVectorstoreCreate({
  openAIApiKey = process.env.OPENAI_API_KEY,
  documents,
}: {
  openAIApiKey?: string;
  documents: LangchainDocument[];
}): Promise<boolean> {
  const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
    new OpenAIEmbeddings({
      openAIApiKey,
    }),
    {
      prisma: Prisma,
      tableName: 'Document',
      vectorColumnName: 'vector',
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    },
  );

  await vectorStore.addModels(
    await prisma.$transaction(
      documents
        .filter((document) => document.pageContent)
        .map((document) =>
          prisma.document.create({
            data: { content: document.pageContent, type: 'github', source: document.metadata.source },
          }),
        ),
    ),
  );

  return true;
}
