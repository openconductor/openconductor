import { ChatOpenAI } from 'langchain/chat_models';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { Tool } from 'langchain/tools';

export class OpenaiPromptGpt extends Tool {
  name = 'openai-PromptGpt';
  description = `Prompt GPT to instruct the assistant and help with a task`;

  chat: ChatOpenAI;
  constructor({ openAIApiKey }: { openAIApiKey?: string }) {
    super();
    this.chat = new ChatOpenAI({ temperature: 0, openAIApiKey });
  }

  async _call(input: string) {
    const result = await this.chat.call([new SystemChatMessage(''), new HumanChatMessage(input)]);
    return result.text;
  }
}
