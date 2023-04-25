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
  langchainAgentCustom,
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

  const startBlock = await createDbBlock({
    workflowId,
    userId,
    input: input,
    name: 'start',
    order: blockIndex,
  });

  while (iterations < maxIterations) {
    try {
      const stepOutput = await langchainAgentCustom({ input, steps });

      if (isAgentFinish(stepOutput)) {
        const endBlock = await createDbBlock({
          workflowId,
          userId,
          input: input,
          name: 'end',
          order: blockIndex,
        });

        await createDbEvent({ blockId: endBlock.id, runId: run.id, status: 'success', output: stepOutput.log });

        output = stepOutput;
        return output;
      }

      blockIndex += 1;
      const blockTool = await createDbBlock({
        workflowId,
        userId,
        input: stepOutput.toolInput,
        name: stepOutput.tool,
        order: blockIndex,
      });

      await createDbEvent({ blockId: blockTool.id, runId: run.id, output: stepOutput.log });

      try {
        const observation = await langchainToolCall({ action: stepOutput });

        await createDbEvent({ blockId: blockTool.id, runId: run.id, output: observation.observation });

        steps.push(observation);

        iterations += 1;
      } catch (error: any) {
        await createDbEvent({ blockId: blockTool.id, runId: run.id, status: 'error', output: error.message });
      }
    } catch (error: any) {
      await createDbEvent({ blockId: startBlock.id, runId: run.id, status: 'error', output: error.message });
    }
  }

  return output;
}
