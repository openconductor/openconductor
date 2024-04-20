import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy, longPolicy } from '../policies';

const { langchainVectorStoreSearch } = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainPromptsDocuments } = proxyActivities<typeof activities>(longPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type vectorPrompt --input='{"query":"what is langchain?"}'

export async function vectorPrompt({ query }: { query: string }): Promise<any> {
  const searchedDocuments = await langchainVectorStoreSearch({ query });

  const result = await langchainPromptsDocuments({ query, documents: searchedDocuments });

  return result;
}
