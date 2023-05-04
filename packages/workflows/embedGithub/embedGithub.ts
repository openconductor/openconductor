import { nonRetryPolicy, longPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

const { vectorstoreCreateDocuments } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainLoaderGithub } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type embedGithub --input='{"repoUrl":"https://github.com/hwchase17/langchainjs/tree/main/docs/docs", "branch":"main", "userId": "clh1zqahz0000qhaacniwlwhm", "teamId":"clh1zqayn0006qhaaxc5qy8lr"}'

export async function embedGithub({
  repoUrl,
  branch,
  accessToken,
  recursive = false,
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

  await vectorstoreCreateDocuments({ documents: loadedDocuments, userId, teamId, repoUrl });

  return true;
}
