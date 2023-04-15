import type * as activities from '@openconductor/activities';
import { Run } from '@openconductor/db/types';
import { proxyActivities, uuid4 } from '@temporalio/workflow';

const { langchainPromptsConversation, getDbWorkflow, createDbRun, createDbEvent, updateDbEvent } = proxyActivities<
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

  let previousBlockResponse = '';

  for (const [index, block] of workflow.blocks.entries()) {
    const event = await createDbEvent(block.id, run.id);
    try {
      const { response, tokens } = await langchainPromptsConversation({
        systemTemplate: block.agent.systemTemplate || undefined,
        promptTemplate: block.agent.promptTemplate || undefined,
        input: index === 0 ? block.input : previousBlockResponse,
      });

      await updateDbEvent(event.id, 'success', response, tokens);
      previousBlockResponse = response;
    } catch (error) {
      await updateDbEvent(event.id, 'failed');
    }
  }

  return run;
}
