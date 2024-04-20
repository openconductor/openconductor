import { nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AuthorType, MessageType } from '@openconductor/db';

const { getDbAccount, githubRepoActivity, createDbMessage } = proxyActivities<typeof activities>(nonRetryPolicy);

export async function refreshMessages({ userId, teamId }: { userId: string; teamId: string }): Promise<boolean> {
  const { access_token: accessToken } = await getDbAccount({
    userId,
    provider: 'github',
  });

  if (!accessToken) {
    throw new ApplicationFailure(`No github token for user ${userId}`);
  }

  const repoOwner = 'microsoft';
  const repoName = 'vscode';

  const { repository } = await githubRepoActivity({ accessToken, repoOwner, repoName });

  // Unified handling for both issues and pull requests
  const items = [...(repository.issues.nodes ?? []), ...(repository.pullRequests.nodes ?? [])];
  for (const item of items) {
    if (!item) continue;
    const itemType = item.__typename === 'Issue' ? 'issue' : 'pull';
    const messageType = item.__typename === 'Issue' ? MessageType.TRIAGE : MessageType.REVIEW;
    const authorType = item.author?.__typename === 'Bot' ? AuthorType.GITHUB_BOT : AuthorType.GITHUB_USER;

    const labels = item.labels?.nodes
      ? item.labels.nodes.map((label) => ({
          where: {
            source_name: {
              source: `${repoOwner}/${repoName}`,
              name: label?.name ?? '',
            },
          },
          create: {
            source: `${repoOwner}/${repoName}`,
            name: label?.name ?? '',
            description: label?.description ?? '',
            color: label?.color ?? '',
            createdAt: label?.createdAt,
          },
        }))
      : undefined;

    // Create a message for the issue or pull request
    const parentMessage = await createDbMessage({
      type: messageType,
      source: `${repoOwner}/${repoName}`,
      sourceId: item.id,
      key: `${itemType}/${item.number}`,
      title: item.title,
      body: item.body,
      url: item.url,
      createdAt: item.createdAt,
      state: item.state,
      author: {
        connectOrCreate: {
          where: {
            type_typeId: {
              type: authorType,
              typeId: item.author?.id ?? '',
            },
          },
          create: {
            type: authorType,
            typeId: item.author?.id ?? '',
            imageUrl: item.author?.avatarUrl,
            handle: item.author?.login ?? '',
            url: item.author?.url,
          },
        },
      },
      creator: {
        connect: { id: userId },
      },
      team: {
        connect: { id: teamId },
      },
      labels: {
        connectOrCreate: [...(labels ?? [])],
      },
    });

    // Process comments for the issue or pull request
    for (const comment of item.comments?.nodes ?? []) {
      if (!comment) continue;
      const commentAuthorType = comment.author?.__typename === 'Bot' ? AuthorType.GITHUB_BOT : AuthorType.GITHUB_USER;
      await createDbMessage({
        type: MessageType.COMMENT,
        source: `${repoOwner}/${repoName}`,
        sourceId: comment.id,
        key: `${itemType}/${item.number}/comment/${comment.databaseId}`,
        title: `Comment on ${itemType === 'issue' ? 'Issue' : 'Pull Request'} #${item.number}`,
        body: comment.body,
        url: comment.url,
        createdAt: comment.publishedAt,
        state: item.state, // Or another appropriate field
        author: {
          connectOrCreate: {
            where: {
              type_typeId: {
                type: commentAuthorType,
                typeId: comment.author?.id ?? '',
              },
            },
            create: {
              type: commentAuthorType,
              typeId: comment.author?.id ?? '',
              imageUrl: comment.author?.avatarUrl,
              handle: comment.author?.login ?? '',
              url: comment.author?.url,
            },
          },
        },
        creator: {
          connect: { id: userId },
        },
        team: {
          connect: { id: teamId },
        },
        parent: {
          connect: {
            id: parentMessage.id,
          },
        },
      });
    }
  }

  return true;
}
