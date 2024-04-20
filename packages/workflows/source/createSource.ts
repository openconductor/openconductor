import { defaultPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { SourceType } from '@openconductor/db';

const { getDbAccount, githubRepoSource, createDbSource } = proxyActivities<typeof activities>(defaultPolicy);

export async function createSource({
  type,
  url,
  userId,
  teamId,
}: {
  type: SourceType;
  url: string;
  userId: string;
  teamId: string;
}) {
  let sourceId = '';

  if (type === SourceType.GITHUB_REPO) {
    const { access_token: accessToken } = await getDbAccount({
      userId,
      provider: 'github',
    });

    if (!accessToken) {
      throw new ApplicationFailure(`No github token for user ${userId}`);
    }

    const [repoOwner, repoName] = url.split('/').slice(3, 5);

    if (!repoOwner || !repoName) {
      throw new ApplicationFailure(`No github repo owner and name for url ${url}`);
    }

    const { repository } = await githubRepoSource({ accessToken, repoOwner, repoName });

    sourceId = `${repoOwner}/${repoName}`;

    return await createDbSource({
      sourceId,
      type,
      name: repository.name,
      url: repository.url,
      imageUrl: repository.openGraphImageUrl,
      description: repository.description,
      createdAt: repository.createdAt,
      creator: {
        connect: {
          id: userId,
        },
      },
      team: {
        connect: {
          id: teamId,
        },
      },
    });
  }
}
