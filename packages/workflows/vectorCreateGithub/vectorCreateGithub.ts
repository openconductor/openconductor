import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy, longPolicy } from '../policies';

const { langchainVectorstoreCreate } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainLoaderGithub } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type vectorCreateGithub --input='{"repoUrl":"https://github.com/hwchase17/langchainjs/tree/main/docs/docs", "branch":"main", "userId": "clgz12b1b0000qht9ixhmeqgi", "teamId":"clgz12bif0006qht9kfgq5aea"}'

export async function vectorCreateGithub({
  repoUrl,
  branch,
  accessToken,
  recursive = true,
  userId,
  teamId,
}: {
  repoUrl: string;
  branch: string;
  accessToken?: string;
  recursive?: boolean;
  userId: string;
  teamId: string;
}): Promise<boolean> {
  const loadedDocuments = await langchainLoaderGithub({
    repoUrl,
    options: {
      branch,
      accessToken,
      recursive,
    },
  });

  await langchainVectorstoreCreate({ documents: loadedDocuments, userId, teamId });

  return true;
}
