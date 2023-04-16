import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy } from '../policies';

const { langchainAgentExecutor } = proxyActivities<typeof activities>(nonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type agentExecutor --input='{"query":"Who is Olivia Wilde boyfriend? What is his current age raised to the 0.23 power?"}'

//tctl workflow run --taskqueue openconductor --workflow_type agentExecutor --input='{"query":"make an article about airbyte with 2 sections. Can you make a list of sections with a title and a prompt of maximum 200 characters for chatgpt mentioning airbyte. I want the result with only an array with object title and prompt."}'

export async function agentExecutor({ query }: { query: string }): Promise<any> {
  const result = await langchainAgentExecutor({ query });

  return result;
}
