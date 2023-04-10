import type * as activities from '@openconductor/activities';
import { Run } from '@openconductor/db';
import { proxyActivities, uuid4 } from '@temporalio/workflow';

const { createLangchainConversationChain, getDbWorkflow, createDbRun, createDbEvent, updateDbEvent } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1m',
  retry: {
    maximumInterval: '5s', // Just for demo purposes. Usually this should be larger.
  },
});

export async function test({ workflowId, userId }: { workflowId: string; userId: string }): Promise<Run> {
  const workflow = await getDbWorkflow(workflowId);
  const temporalId = uuid4();
  const run = await createDbRun(workflow.id, temporalId, userId);

  for (const block of workflow.blocks) {
    const event = await createDbEvent(block.id, run.id);
    try {
      const { response, tokens } = await createLangchainConversationChain(block.input);
      await updateDbEvent(event.id, 'success', response, tokens);
    } catch (error) {
      await updateDbEvent(event.id, 'failed');
    }
  }

  return run;
}
