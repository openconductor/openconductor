import { AgentAction } from 'langchain/schema';
import { Tool } from 'langchain/tools';

export async function handleAgentAction({
  tools,
  action,
  verbose,
}: {
  tools: Tool[];
  action: AgentAction;
  verbose: boolean;
}): Promise<{ action: AgentAction; observation: string }> {
  const toolsByName = Object.fromEntries(tools.map((t) => [t.name.toLowerCase(), t]));

  const tool = toolsByName[action.tool?.toLowerCase()];
  const observation = tool
    ? await tool.call(action.toolInput, verbose)
    : `${action.tool} is not a valid tool, try another one.`;

  return { action, observation };
}
