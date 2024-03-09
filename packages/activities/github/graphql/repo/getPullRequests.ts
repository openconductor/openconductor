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
      query repositoryStargazers($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          issues(last:20) {
            nodes {
              id
              createdAt
              title
              body
              url
              number
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
    repo: repoName,
  });

  return repository;
}
