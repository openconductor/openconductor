import { graphql } from '@octokit/graphql';
import { z } from 'zod';
// import { UsageOutput, openaiZodChat } from './utils/openaiZodChat';
import { Message } from '@openconductor/db';
import { Repository } from '@octokit/graphql-schema';

export const addLabel = async ({ label, accessToken, issue, owner, repo }: { label: Message, accessToken: string, issue: number, owner: string, repo: string }) => {
  const query = `
    query($number: Int!, $name: String!, $owner: String!, $label: String!) {
        repository(name: $name, owner: $owner) {
        issue(number: $number) {
            id
        }
        label(name: $labelName2) {
            id
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
    "number": issue,
    "name": repo,
    "owner": owner,
    "label": label
  });

  console.log(repository)

  return repository
};
