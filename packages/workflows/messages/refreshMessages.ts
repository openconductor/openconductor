import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';

const { getDbAccount, githubRepoPullRequests, createDbMessage } = proxyActivities<typeof activities>(nonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type refreshMessages --input='{"repoUrl":"https://github.com/hwchase17/langchainjs/tree/main/docs/docs", "branch":"main", "userId": "clh1zqahz0000qhaacniwlwhm", "teamId":"clh1zqayn0006qhaaxc5qy8lr"}'

export async function refreshMessages({ userId, teamId }: { userId: string; teamId: string }): Promise<boolean> {
  const { access_token: accessToken } = await getDbAccount({
    userId,
    provider: 'github',
  });

  if (!accessToken) {
    throw new ApplicationFailure(`No github token for user ${userId}`);
  }

  const repoOwner = 'apache';
  const repoName = 'superset';

  const { repository } = await githubRepoPullRequests({ accessToken, repoOwner, repoName });

  const githubPullRequests = repository.pullRequests?.nodes;
  if (githubPullRequests?.[0]) {
    for (const githubPullRequest of githubPullRequests) {
      await createDbMessage({
        source: `${repoOwner}/${repoName}`,
        sourceId: githubPullRequest?.id ?? '',
        key: `pull/${githubPullRequest?.number}`,
        title: githubPullRequest?.title ?? '',
        body: githubPullRequest?.body ?? '',
        url: githubPullRequest?.url ?? '',
        createdAt: githubPullRequest?.createdAt,
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
  const githubIssues = repository.issues?.nodes;
  if (githubIssues?.[0]) {
    for (const githubIssue of githubIssues) {
      await createDbMessage({
        source: `${repoOwner}/${repoName}`,
        sourceId: githubIssue?.id ?? '',
        key: `issue/${githubIssue?.number}`,
        title: githubIssue?.title ?? '',
        body: githubIssue?.body ?? '',
        url: githubIssue?.url ?? '',
        createdAt: githubIssue?.createdAt,
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

  return true;
}
