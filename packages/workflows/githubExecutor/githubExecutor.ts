import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy } from '../policies';

const { langchainGithubAgent } = proxyActivities<typeof activities>(nonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type githubExecutor --input='{"owner":"openconductor","repo":"sandbox", "issue":"https://github.com/openconductor/sandbox/issues/1"}'

export async function githubExecutor({ owner, repo, issue }: { owner: string; repo; issue: string }): Promise<any> {
  const result = await langchainGithubAgent({
    owner,
    repo,
    issue,
  });

  return result;
}
