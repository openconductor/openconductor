import { prisma } from '@openconductor/db';
import { Document, DocumentTypes, Prisma } from '@openconductor/db/types';
import { Document as LangchainDocument } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';

export async function langchainVectorstoreCreate({
  openAIApiKey = process.env.OPENAI_API_KEY,
  documents,
  userId,
  teamId,
}: {
  openAIApiKey?: string;
  documents: LangchainDocument[];
  userId: string;
  teamId: string;
}): Promise<number> {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(embeddings, {
    prisma: Prisma,
    tableName: 'Document',
    vectorColumnName: 'embedding',
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });

  await vectorStore.addModels(
    await prisma.$transaction(
      documents
        .filter((document) => document.pageContent)
        .map((document) =>
          prisma.document.create({
            data: {
              content: document.pageContent,
              type: DocumentTypes.GITHUB,
              source: document.metadata.source,
              creator: {
                connect: { id: userId },
              },
              team: {
                connect: { id: teamId },
              },
            },
          }),
        ),
    ),
  );

  const addedDocuments = documents.filter((document) => document.pageContent).length;

  return addedDocuments;
}
