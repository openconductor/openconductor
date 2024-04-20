import { OpenAI, BaseLLM } from 'langchain/llms';

export async function langchainModelsOpenai({
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  openAIApiKey?: string;
}): Promise<BaseLLM> {
  return new OpenAI({
    openAIApiKey,
  }) as BaseLLM;
}
