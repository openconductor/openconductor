import { ZodObject } from 'zod';
import { ApplicationFailure } from '@temporalio/activity';
import { zodPrompt } from './zodPrompt';
import { openaiClient } from './openaiClient';
import { openaiCost } from './openaiPrices';

export type UsageOutput = { tokens: number; cost: number };

export const openaiZodChat = async ({
  zodSchema,
  template,
}: {
  zodSchema: ZodObject<any>;
  template: string;
}): Promise<{ response: object; usage: UsageOutput }> => {
  const parserPrompt = await zodPrompt({ zodSchema });

  // const model = "gpt-3.5-turbo-1106";
  const model = 'gpt-4-0125-preview';

  const completion = await openaiClient.chat.completions.create({
    messages: [
      { role: 'system', content: parserPrompt },
      { role: 'user', content: template },
    ],
    response_format: { type: 'json_object' },
    model,
    temperature: 0,
  });

  const assistantAnswer = completion.choices[0]?.message.content;

  try {
    const parsedAnswer = JSON.parse(assistantAnswer!);

    return {
      response: parsedAnswer,
      usage: {
        tokens: completion.usage?.total_tokens ?? 0,
        cost: openaiCost({
          model,
          tokensCountInput: completion.usage?.prompt_tokens ?? 0,
          tokensCountOutput: completion.usage?.completion_tokens ?? 0,
        }),
      },
    };
  } catch (error) {
    throw ApplicationFailure.nonRetryable(`Error parsing response: ${assistantAnswer}`);
  }
};
