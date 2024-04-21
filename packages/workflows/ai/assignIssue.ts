import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';

const { addLabel, getDbAccount, getLabelIdByName } =
  proxyActivities<typeof activities>(nonRetryPolicy);

export async function assignIssue({ userId, owner, repo, issueId }: { userId: string, owner: string, repo: string, issueId: string }): Promise<boolean> {
  const { access_token: accessToken } = await getDbAccount({
    userId,
    provider: 'github',
  });

  if (!accessToken) {
    throw new ApplicationFailure(`No github token for user ${userId}`);
  }

  const labelId = await getLabelIdByName({
    label: "sweep", accessToken, owner, repo
  })

  await addLabel({
    labelId, accessToken, issueId
  });

  return true;
}
