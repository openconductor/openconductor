import { graphql } from '@octokit/graphql';
import { Repository } from '@octokit/graphql-schema';

export async function githubRepoActivity({
  accessToken,
  repoOwner,
  repoName,
}: {
  accessToken: string;
  repoOwner: string;
  repoName: string;
}) {
  // https://studio.apollographql.com/public/github/variant/current/explorer

  // issues(last:25, labels: ["good first issue"]) {

  const query = `
      query repositoryActivity($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          issues(last:25) {
            nodes {
              __typename
              id
              createdAt
              title
              body
              url
              number
              state
              author {
                __typename
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
              comments(last:25) {
                nodes {
                  author {
                    __typename
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
              labels(last:25) {
                nodes {
                  name
                  id
                  description
                  createdAt
                  color
                  updatedAt
                  isDefault
                }
              }
            }
          }
          pullRequests(last:25) {
            nodes {
              __typename
              id
              createdAt
              title
              body
              url
              number
              state
              author {
                __typename
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
              comments(last:25) {
                nodes {
                  __typename
                  author {
                    __typename
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
              labels(last:25) {
                nodes {
                  name
                  id
                  description
                  createdAt
                  color
                  updatedAt
                  isDefault
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
