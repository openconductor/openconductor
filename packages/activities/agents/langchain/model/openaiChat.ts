import { ChatOpenAI } from 'langchain/chat_models/openai';

export async function langchainModelsOpenaiChat({
  openAIApiKey = process.env.OPENAI_API_KEY,
  modelName = 'gpt-3.5-turbo',
  temperature = 0,
}: {
  openAIApiKey?: string;
  modelName?: string;
  temperature?: number;
}): Promise<ChatOpenAI> {
  const chat = new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature,
  });

  return chat;
}
