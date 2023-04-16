import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy, longPolicy } from '../policies';

const { langchainVectorstoreCreate } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainLoaderGithub } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type vectorCreateGithub --input='{"repoUrl":"https://github.com/hwchase17/langchainjs/tree/main/docs/docs", "branch":"main"}'

export async function vectorCreateGithub({
  repoUrl,
  branch,
  accessToken,
  recursive = true,
}: {
  repoUrl: string;
  branch: string;
  accessToken?: string;
  recursive?: boolean;
}): Promise<boolean> {
  const loadedDocuments = await langchainLoaderGithub({
    repoUrl,
    options: {
      branch,
      accessToken,
      recursive,
    },
  });

  await langchainVectorstoreCreate({ documents: loadedDocuments });

  return true;
}
