import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';

const { getDbMessage, embedMessage, searchByEmbedding } = proxyActivities<typeof activities>(nonRetryPolicy);

export async function embedSimilarMessages({ userId, messageId }: { userId: string; messageId: string }) {
  const message = await getDbMessage({
    messageId,
  });

  if (userId && !message) {
    throw new ApplicationFailure(`No message for messageId ${messageId}`);
  }

  const { embedding } = await embedMessage({ messageId });

  const similarMessages = await searchByEmbedding({ embedding });

  return similarMessages;
}
