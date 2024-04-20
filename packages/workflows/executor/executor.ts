import type * as activities from '@openconductor/activities';
import { proxyActivities, uuid4 } from '@temporalio/workflow';
import { AgentAction, AgentFinish, AgentStep } from 'langchain/schema';

import { nonRetryPolicy } from '../policies';

const {
  getDbWorkflow,
  createDbRun,
  createDbBlock,
  createDbEvent,
  updateDbEvent,
  langchainToolCall,
  langchainZeroShotAgent,
} = proxyActivities<typeof activities>(nonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type executor --input='{"input":"make an article about airbyte with 2 sections. Can you make a list of sections with a title and a prompt of maximum 200 characters for chatgpt mentioning airbyte. I want the result with only an array with object title and prompt."}'
// tctl workflow run --taskqueue openconductor --workflow_type executor --input='{"input":"example"}'

export async function executor({
  workflowId,
  userId,
  input,
  maxIterations = 15,
}: {
  workflowId: string;
  userId: string;
  input: string;
  maxIterations?: number;
}): Promise<any> {
  const workflow = await getDbWorkflow({ workflowId });
  const temporalId = uuid4();
  const run = await createDbRun({
    workflowId: workflow.id,
    temporalId,
    userId,
  });

  let iterations = 0;
  const steps: AgentStep[] = [];

  let output: AgentFinish = {
    returnValues: {
      output: false,
    },
    log: '',
  };

  function isAgentFinish(obj: any): obj is AgentFinish {
    return obj && obj.hasOwnProperty('returnValues') && obj.hasOwnProperty('log');
  }

  let blockIndex = 0;

  while (iterations < maxIterations) {
    const block = await createDbBlock({
      workflowId,
      userId,
      input: input,
      name: 'chatgpt',
      order: blockIndex,
    });

    blockIndex += 1;

    const event = await createDbEvent({ blockId: block.id, runId: run.id });

    const stepOutput = await langchainZeroShotAgent({ input, steps });

    await updateDbEvent({ eventId: event.id, status: 'success', output: stepOutput.log });

    if (isAgentFinish(stepOutput)) {
      output = stepOutput;
      return output;
    }

    let actions: AgentAction[];
    if (Array.isArray(stepOutput)) {
      actions = stepOutput as AgentAction[];
    } else {
      actions = [stepOutput as AgentAction];
    }

    const newSteps = await Promise.all(
      actions.map(async (action) => {
        blockIndex += 1;
        const block = await createDbBlock({
          workflowId,
          userId,
          input: action.toolInput,
          name: action.tool,
          order: blockIndex,
        });

        const event = await createDbEvent({ blockId: block.id, runId: run.id });

        const observation = await langchainToolCall({ action });

        await updateDbEvent({ eventId: event.id, status: 'success', output: observation.observation });

        return observation;
      }),
    );

    steps.push(...newSteps);

    iterations += 1;
  }

  return output;
}
