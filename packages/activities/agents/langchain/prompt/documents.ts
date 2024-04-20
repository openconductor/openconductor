import { loadQARefineChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAI } from 'langchain/llms/openai';

export async function langchainPromptsDocuments({
  query,
  documents,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  query: string;

  documents: Document<
    // @ts-ignore
    SimilarityModel<Record<string, unknown>, Document>
  >[];
  openAIApiKey?: string;
}) {
  const model = new OpenAI({
    openAIApiKey,
  });

  const chain = loadQARefineChain(model);

  const result = chain.call({
    input_documents: documents,
    question: query,
  });

  return result;
}
