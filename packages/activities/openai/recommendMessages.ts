import { z } from 'zod';
import { UsageOutput, openaiZodChat } from './utils/openaiZodChat';
import { Message } from '@openconductor/db';

const zodSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().describe('The id of the message'),
      title: z.string().describe('The title of the message'),
      reason: z.string().describe('Reason why i should work on this one before the others'),
    }),
  ),
});

type MetadataOutput = {
  output: z.infer<typeof zodSchema>;
  usage: UsageOutput;
};

export const openaiRecommendMessages = async ({ messages }: { messages: Message[] }): Promise<MetadataOutput> => {
  const template = `
  I am a first contributor to open source.
  Here is a list of open issues.
  I would like to have it sorted so I can pick which issue that would be easy to contribute to in less than 30 minutes.
  Ideally grouped by type of contribution needed so i dont have much context switch.
  Give me maximum 10 messages back. 
  
  - Messages:
  
  ${JSON.stringify(messages)}`;

  const openaiOutput = await openaiZodChat({
    zodSchema,
    template,
  });

  return {
    output: openaiOutput.response as MetadataOutput['output'],
    usage: openaiOutput.usage,
  };
};
