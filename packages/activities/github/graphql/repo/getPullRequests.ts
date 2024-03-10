import { graphql } from '@octokit/graphql';
import { Repository } from '@octokit/graphql-schema';

export async function githubRepoPullRequests({
  accessToken,
  repoOwner,
  repoName,
}: {
  accessToken: string;
  repoOwner: string;
  repoName: string;
}) {
  // https://docs.github.com/en/graphql/overview/explorer
  const query = `
      query repositoryActivity($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          issues(last:20) {
            nodes {
              id
              createdAt
              title
              body
              url
              number
              state
              author {
                avatarUrl
                login
                url
                ... on Bot {
                  id
                }
                ... on User {
                  id
                }
              }
              comments(last:100) {
                nodes {
                  author {
                    avatarUrl
                    login
                    url
                    ... on Bot {
                      id
                    }
                    ... on User {
                      id
                    }
                  }
                  body
                  databaseId
                  id
                  publishedAt
                  url
                }
              }
            }
          }
          pullRequests(last:20) {
            nodes {
              id
              createdAt
              title
              body
              url
              number
              state
              author {
                avatarUrl
                login
                url
                ... on Bot {
                  id
                }
                ... on User {
                  id
                }
              }
              comments(last:100) {
                nodes {
                  author {
                    avatarUrl
                    login
                    url
                    ... on Bot {
                      id
                    }
                    ... on User {
                      id
                    }
                  }
                  body
                  databaseId
                  id
                  publishedAt
                  url
                }
              }
            }
          }
        }
      }
    `;

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });

  const repository = await graphqlWithAuth<{ repository: Repository }>(query, {
    owner: repoOwner,
    name: repoName,
  });

  return repository;
}
