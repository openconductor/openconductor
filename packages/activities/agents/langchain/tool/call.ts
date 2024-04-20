import { langchainToolRegistry } from './registry';
import { AgentAction } from 'langchain/schema';

export async function langchainToolCall({ action }: { action: AgentAction }): Promise<{
  action: AgentAction;
  observation: string;
}> {
  const tools = await langchainToolRegistry();
  const toolsByName = Object.fromEntries(tools.map((t) => [t.name.toLowerCase(), t]));

  const tool = toolsByName[action.tool?.toLowerCase()];

  const observation = tool ? await tool.call(action.toolInput) : `${action.tool} is not a valid tool, try another one.`;

  return { action, observation };
}
