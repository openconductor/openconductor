import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class OpenaiPromptGpt extends StructuredTool {
  name = 'openai-PromptGpt';
  description = `Prompt GPT to instruct the assistant and help with a task. Please format your input as an object with the following parameters:
  - "prompt": (string) [REQUIRED] The prompt to be given to chatgpt.
  - "context": (string) [REQUIRED] Additional context to help assistant with context.`;

  schema = z.object({
    prompt: z.string(),
    context: z.string(),
  });

  chat: ChatOpenAI;
  constructor({ openAIApiKey }: { openAIApiKey?: string }) {
    super();
    this.chat = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0, openAIApiKey });
  }

  async _call({ prompt, context }: z.infer<typeof this.schema>) {
    const template = [`${context && `given following context: ${context}`}`, prompt].join('\n\n');

    const result = await this.chat.call([new SystemChatMessage(''), new HumanChatMessage(template)]);
    return result.text;
  }
}
