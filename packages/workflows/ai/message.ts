import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AiItemType } from '@openconductor/db';

const { getDbMessage, embedMessage, openaiAugmentMessage, createAiItem } =
  proxyActivities<typeof activities>(nonRetryPolicy);

export async function aiMessage({ messageId }: { messageId: string }): Promise<boolean> {
  const message = await getDbMessage({
    messageId,
  });

  if (!message) {
    throw new ApplicationFailure(`No message for messageId ${messageId}`);
  }

  // Summary short and long like Superhuman

  const aiSummary = await openaiAugmentMessage({ message });

  await createAiItem({
    type: AiItemType.SUMMARY,
    response: aiSummary.output,
    tokens: aiSummary.usage.tokens,
    cost: aiSummary.usage.cost,
    createdAt: new Date(),
    updatedAt: new Date(),
    message: {
      connect: {
        id: messageId,
      },
    },
  });

  await embedMessage({ messageId });

  // Triage
  // priority non urgent/hight/medium/low

  // similar
  // difficulty -> first contribution
  // assignement / specialist

  // Vector for similar issues like Linear
  // Issues -> context switch prompt

  // Suggestion of labels

  // Reply suggestion

  // Action / Specs suggestion

  return true;
}
