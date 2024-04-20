import type * as activities from '@openconductor/activities';
import { proxyActivities } from '@temporalio/workflow';

import { nonRetryPolicy } from '../policies';

const { langchainAutogptAgent } = proxyActivities<typeof activities>(nonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type autogptExecutor --input='{"query":"write a weather report for SF today"}'

export async function autogptExecutor({ query }: { query: string }): Promise<any> {
  const result = await langchainAutogptAgent({ input: query });

  return result;
}
