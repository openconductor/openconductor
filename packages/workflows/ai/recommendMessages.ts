import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';

const { getDbMessagesInclude, openaiRecommendMessages } = proxyActivities<typeof activities>(nonRetryPolicy);

export async function aiRecommendMessages({ userId, teamId }: { userId: string; teamId: string }): Promise<boolean> {
  const messages = await getDbMessagesInclude({
    teamId,
    include: {
      aiItems: true,
      labels: true,
      source: true,
      author: true,
    },
  });

  if (!messages) {
    throw new ApplicationFailure(`No open messages for teamId ${teamId}`);
  }

  const openMessages = messages
    .filter((message) => message.aiItems.length > 0)
    .map((message) => ({
      title: message.title,
      summary: message.aiItems?.[0]?.response?.summary,
      bullets: message.aiItems?.[0]?.response?.bullets,
      labels: message.labels,
      source: message.source,
      createdAt: message.createdAt,
      author: message.author,
    }));

  const aiRecommendations = await openaiRecommendMessages({ messages: openMessages });

  return aiRecommendations;
}
