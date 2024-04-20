import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy } from '../policies';

const { langchainGithubAgent } = proxyActivities<typeof activities>(nonRetryPolicy);

//tctl workflow run --taskqueue openconductor --workflow_type githubExecutor --input='{"repo_full":"https://github.com/airbytehq/airbyte", "issue":"https://github.com/airbytehq/airbyte/issues/25419"}'

export async function githubExecutor({ repo_full, issue }: { repo_full: string; issue: string }): Promise<any> {
  const result = await langchainGithubAgent({
    repo_full,
    issue,
  });

  return result;
}
