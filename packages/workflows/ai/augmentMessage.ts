import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AiItemType } from '@openconductor/db';

const { getDbMessage, embedMessage, openaiAugmentMessage, createAiItem, searchByEmbedding } =
  proxyActivities<typeof activities>(nonRetryPolicy);

export async function aiAugmentMessage({ messageId }: { messageId: string }): Promise<boolean> {
  const message = await getDbMessage({
    messageId,
  });

  if (!message) {
    throw new ApplicationFailure(`No message for messageId ${messageId}`);
  }

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

  const { embedding } = await embedMessage({ messageId });

  await searchByEmbedding({ embedding });

  // difficulty -> first contribution
  // assignement / specialist
  // Issues -> context switch prompt
  // Suggestion of labels

  return true;
}
