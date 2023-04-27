import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy, longPolicy } from '../policies';

const { vectorstoreCreateDocuments } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainLoaderGithub } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type embedGithub --input='{"repoUrl":"https://github.com/hwchase17/langchainjs/tree/main/docs/docs", "branch":"main", "userId": "clgzbemk30000qh5538q7bkct", "teamId":"clgzben100006qh5598tdwquh"}'

export async function embedGithub({
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

  await vectorstoreCreateDocuments({ documents: loadedDocuments, userId, teamId });

  return true;
}
