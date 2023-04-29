import type * as activities from '@openconductor/activities';
import { proxyActivities, uuid4 } from '@temporalio/workflow';
import { AgentAction, AgentFinish, AgentStep } from 'langchain/schema';

import { longNonRetryPolicy, nonRetryPolicy } from '../policies';

const {
  getDbAgent,
  createDbRun,
  deleteDbBlocks,
  createDbBlock,
  createDbEvent,
  updateDbEvent,
  langchainPromptTemplate,
} = proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainToolCall, langchainAgentCustom } = proxyActivities<typeof activities>(longNonRetryPolicy);

export async function runAgent({
  agentId,
  userId,
  prompt,
  input,
  enabledPlugins = ['documents', 'filesystem'],
  // enabledPlugins = ['documents', 'github', 'git', 'filesystem', 'calculator', 'serp'],
  maxIterations = 15,
}: {
  agentId: string;
  userId: string;
  prompt: string;
  input: Record<string, any>;
  enabledPlugins?: string[];
  maxIterations?: number;
}): Promise<any> {
  const agent = await getDbAgent({ agentId });
  const temporalId = uuid4();
  const run = await createDbRun({
    agentId: agent.id,
    temporalId,
    userId,
  });

  if (agent.playground) await deleteDbBlocks({ agentId: agent.id });

  const renderedPrompt = await langchainPromptTemplate({ prompt, input });

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
    agentId,
    userId,
    input: renderedPrompt,
    name: 'start',
    order: blockIndex,
  });

  while (iterations < maxIterations) {
    try {
      const stepOutput = await langchainAgentCustom({ input: renderedPrompt, enabledPlugins, steps });

      if (isAgentFinish(stepOutput)) {
        const endBlock = await createDbBlock({
          agentId,
          userId,
          input: renderedPrompt,
          name: 'end',
          order: blockIndex,
        });

        await createDbEvent({ blockId: endBlock.id, runId: run.id, status: 'success', output: stepOutput.log });

        output = stepOutput;
        return output;
      }

      blockIndex += 1;
      const blockTool = await createDbBlock({
        agentId,
        userId,
        input: stepOutput.toolInput,
        name: stepOutput.tool,
        order: blockIndex,
      });

      await createDbEvent({ blockId: blockTool.id, runId: run.id, output: stepOutput.log });

      try {
        const observation = await langchainToolCall({ action: stepOutput });

        await createDbEvent({
          blockId: blockTool.id,
          runId: run.id,
          output: observation.observation,
          status: 'success',
        });

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
