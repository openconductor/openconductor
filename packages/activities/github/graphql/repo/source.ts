import { graphql } from '@octokit/graphql';
import { Repository } from '@octokit/graphql-schema';

export async function githubRepoSource({
  accessToken,
  repoOwner,
  repoName,
}: {
  accessToken: string;
  repoOwner: string;
  repoName: string;
}) {
  // https://studio.apollographql.com/public/github/variant/current/explorer

  const query = `
      query repository($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          name
          openGraphImageUrl
          createdAt
          url
          description
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
