import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy, longPolicy } from '../policies';

const { langchainVectorstoreCreate } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainLoaderGithub } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type vectorCreateGithub --input='{"repoUrl":"https://github.com/airbytehq/airbyte/tree/master/docs"}'

export async function vectorCreateGithub({
  repoUrl,
  accessToken,
  recursive = false,
}: {
  repoUrl: string;
  accessToken?: string;
  recursive?: boolean;
}): Promise<any> {
  const loadedDocuments = await langchainLoaderGithub({
    repoUrl,
    options: {
      accessToken,
      recursive,
    },
  });

  await langchainVectorstoreCreate({ documents: loadedDocuments });

  return true;
}
