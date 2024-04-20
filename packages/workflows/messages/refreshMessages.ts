import { defaultPolicy, nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import { AuthorType, MessageType, SourceType } from '@openconductor/db';

const { getDbAccount, getDbSources, createDbMessage } = proxyActivities<typeof activities>(defaultPolicy);
const { githubRepoActivity } = proxyActivities<typeof activities>(nonRetryPolicy);

export async function refreshMessages({ userId, teamId }: { userId: string; teamId: string }) {
  const { access_token: accessToken } = await getDbAccount({
    userId,
    provider: 'github',
  });

  if (!accessToken) {
    throw new ApplicationFailure(`No github token for user ${userId}`);
  }

  const sources = await getDbSources({ teamId, type: SourceType.GITHUB_REPO });

  const refreshPromises = sources.map(async (source) => {
    const [repoOwner, repoName] = source.url.split('/').slice(3, 5);

    if (!repoOwner || !repoName) {
      throw new ApplicationFailure(`No github repoOwner and repoName for url ${source.url}`);
    }

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
              sourceId_sourceReferenceId: {
                sourceId: source.id,
                sourceReferenceId: label?.id ?? '',
              },
            },
            create: {
              sourceReferenceId: label?.id ?? '',
              source: {
                connect: {
                  id: source.id,
                },
              },
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
        sourceReferenceId: item.id,
        key: `${itemType}/${item.number}`,
        title: item.title,
        body: item.body,
        url: item.url,
        createdAt: item.createdAt,
        state: item.state,
        source: {
          connect: {
            id: source.id,
          },
        },
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
              sources: {
                connect: {
                  id: source.id,
                },
              },
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
          sourceReferenceId: comment.id,
          key: `${itemType}/${item.number}/comment/${comment.databaseId}`,
          title: `Comment on ${itemType === 'issue' ? 'Issue' : 'Pull Request'} #${item.number}`,
          body: comment.body,
          url: comment.url,
          createdAt: comment.publishedAt,
          state: item.state, // Or another appropriate field
          source: {
            connect: {
              id: source.id,
            },
          },
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
                sources: {
                  connect: {
                    id: source.id,
                  },
                },
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
  });

  return Promise.all(refreshPromises);
}
