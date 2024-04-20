import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AiItemType } from '@openconductor/db';

const { addLabel } =
  proxyActivities<typeof activities>(nonRetryPolicy);

export async function assignIssue({ messageId }: { messageId: string }): Promise<boolean> {
  const issue_stuff = await addLabel({
    messageId,
  });

  if (!issue_stuff) {
    throw new ApplicationFailure(`No issue for issueId ${messageId}`);
  }

//   const issue_stuff = await openaiAugmentMessage({ message });

  console.log(issue_stuff)

  return true;
}
