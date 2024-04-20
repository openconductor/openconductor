import { AutoGPT } from 'langchain/experimental/autogpt';
import { ChatOpenAI } from 'langchain/chat_models/openai';

import { langchainToolRegistry } from '../tool/registry';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export async function langchainAutogptAgent({
  input,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  input: string;
  openAIApiKey?: string;
}): Promise<string | undefined> {
  const tools = await langchainToolRegistry();

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({ openAIApiKey }));

  const autogpt = AutoGPT.fromLLMAndTools(new ChatOpenAI({ temperature: 0, openAIApiKey }), tools, {
    memory: vectorStore.asRetriever(),
    aiName: 'Tom',
    aiRole: 'Assistant',
    maxIterations: 5,
  });

  const agent = await autogpt.run([input]);

  return agent;
}
