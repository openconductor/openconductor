import { longNonRetryPolicy, nonRetryPolicy } from '../policies';
import type * as activities from '@openconductor/activities';
import { proxyActivities, uuid4 } from '@temporalio/workflow';

const { getDbAgent, createDbRun, deleteDbBlocks, langchainTools, langchainPromptTemplate } =
  proxyActivities<typeof activities>(nonRetryPolicy);

const { langchainAgentConductor } = proxyActivities<typeof activities>(longNonRetryPolicy);

// tctl workflow run --taskqueue openconductor --workflow_type runConductor

export async function runConductorTool({
  agentId,
  userId,
  prompt,
  input,
  enabledPlugins = ['openai', 'google', 'calculator', 'openconductor', 'github', 'git', 'filesystem'],
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

  const tools = await langchainTools({ enabledPlugins, userId });

  const stepOutput = await langchainAgentConductor({ input: renderedPrompt, tools, userId });

  return stepOutput;
}
