import { z } from 'zod';
import { UsageOutput, openaiZodChat } from './utils/openaiZodChat';
import { Message } from '@openconductor/db';

const zodSchema = z.object({
  summary: z.string().describe('1-line summary'),
  bullets: z.array(z.string()).describe('Each bullet point summary item'),
  priority: z.enum(['none', 'urgent', 'high', 'medium', 'low']),
  suggestions: z.array(
    z.object({
      cta: z.string().describe('Call to action for that suggestion'),
      body: z.string().describe('The body of suggestion'),
    }),
  ),
});

type MetadataOutput = {
  output: z.infer<typeof zodSchema>;
  usage: UsageOutput;
};

export const openaiAugmentMessage = async ({ message }: { message: Message }): Promise<MetadataOutput> => {
  const template = `
  You are provided the following ${message.type} from ${message.source}.
  Make a summary for this message. Don't mention the word "summary".
  With a one line explanation and max 5 bullet points.
  Set a priority for this ${message.type} in the scope of all possible items in ${message.source} and based on summary.
  The user needs to take immediate action, lets help him win time by giving suggestion of replies.
  
  - Example of suggestions could be:
  For issues: should the user reply, close, solve the issue.
  For pull requests: should the user close without merging, approve the merge, ask for fixes.

  If a reply is suggested, make a draft reply on behalf of the user.
  If a task is suggested, explain the suggested next steps and be concise.
  
  - Message:
  
  ${JSON.stringify(message)}`;

  const openaiOutput = await openaiZodChat({
    zodSchema,
    template,
  });

  return {
    output: openaiOutput.response as MetadataOutput['output'],
    usage: openaiOutput.usage,
  };
};
