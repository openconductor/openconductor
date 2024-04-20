import { langchainTool } from '.';
import { AgentAction } from 'langchain/schema';

export async function langchainToolCall({
  action,
  verbose = true,
}: {
  action: AgentAction;
  verbose?: boolean;
}): Promise<{
  action: AgentAction;
  observation: string;
}> {
  const tools = await langchainTool();
  const toolsByName = Object.fromEntries(tools.map((t) => [t.name.toLowerCase(), t]));

  const tool = toolsByName[action.tool?.toLowerCase()];

  const observation = tool
    ? await tool.call(action.toolInput, verbose)
    : `${action.tool} is not a valid tool, try another one.`;

  return { action, observation };
}
