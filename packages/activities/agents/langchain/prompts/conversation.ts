import { Block } from '@openconductor/db/types';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models';
import { BufferMemory } from 'langchain/memory';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

export async function langchainPromptsConversation({
  systemTemplate = 'The following is a friendly conversation between a human and an AI. The AI is straight-to-the-point and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. If the user asks for a list, the AI should give the list directly without adding text before or after the list. If appropriate, you can return some or all of your response as Markdown. This includes using appropriate headings, lists, code snippets, Mermaid diagrams, etc.',
  promptTemplate = '{text}',
  input,
}: {
  systemTemplate?: string;
  promptTemplate?: string;
  input: Block['input'];
}): Promise<{ response: string; tokens: number }> {
  const chat = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL_NAME ?? 'gpt-3.5-turbo',
    temperature: 0,
  });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate(promptTemplate),
  ]);
  const chain = new ConversationChain({
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    }),
    prompt: chatPrompt,
    llm: chat,
  });

  const chainValue = await chain.call({
    text: input,
  });

  const numTokens = await chat.getNumTokens('How many tokens are in this input?');

  return {
    response: chainValue.response,
    tokens: numTokens,
  };
}
