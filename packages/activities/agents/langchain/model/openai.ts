import { BaseLLM } from 'langchain/llms/base';
import { OpenAI } from 'langchain/llms/openai';

export async function langchainModelsOpenai({
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  openAIApiKey?: string;
}): Promise<BaseLLM> {
  return new OpenAI({
    openAIApiKey,
  }) as BaseLLM;
}
