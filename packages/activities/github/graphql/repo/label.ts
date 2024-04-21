import { graphql } from '@octokit/graphql';
import { z } from 'zod';
// import { UsageOutput, openaiZodChat } from './utils/openaiZodChat';
import { Message } from '@openconductor/db';
import { Repository } from '@octokit/graphql-schema';
import { ApplicationFailure } from '@temporalio/activity';

export const addLabel = async ({ labelId, accessToken, issueId }: { labelId: string, accessToken: string, issueId: string }) => {
  const query = `
    mutation AddLabelsToLabelable($input: AddLabelsToLabelableInput!) {
      addLabelsToLabelable(input: $input) {
        labelable {
          ... on Discussion {
            id
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
    "input": {
      "labelIds": labelId,
      "labelableId": issueId
    }
  });

  return true
};


export const getLabelIdByName = async ({ label, accessToken, owner, repo }: { label: string, accessToken: string, owner: string, repo: string }): Promise<string> => {
  const query = `
    query($name: String!, $owner: String!, $label: String!) {
        repository(name: $name, owner: $owner) {
        label(name: $label) {
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
    "name": repo,
    "owner": owner,
    "label": label
  });

  const labelId = repository.repository.label?.id

  if (!labelId) throw new ApplicationFailure(`LabelId is invalid`);

  return labelId
};
