import { defaultPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AiAgentType, SourceType } from '@openconductor/db';

const { getDbAccount, githubRepoSource, createDbAiAgent } = proxyActivities<typeof activities>(defaultPolicy);

export async function createAiAgent({
  type,
  url,
  userId,
  teamId,
}: {
  type: AiAgentType;
  url: string;
  userId: string;
  teamId: string;
}) {
  let aiAgentId = '';

  if (type === AiAgentType.GITHUB_REPO) {
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

    aiAgentId = `${repoOwner}/${repoName}`;

    return await createDbAiAgent({
      aiAgentId,
      type,
      name: repository.name.toLowerCase(),
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
