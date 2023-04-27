import { langchainToolRegistry } from './registry';
import { AgentAction } from 'langchain/schema';

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export async function langchainToolCall({ action }: { action: AgentAction }): Promise<{
  action: AgentAction;
  observation: string;
}> {
  const tools = await langchainToolRegistry();
  const toolsByName = Object.fromEntries(tools.map((t) => [t.name.toLowerCase(), t]));

  const tool = toolsByName[action.tool?.toLowerCase()];

  const toolInput = isJsonString(action.toolInput) ? JSON.parse(action.toolInput) : action.toolInput;

  const observation = tool ? await tool.call(toolInput) : `${action.tool} is not a valid tool, try another one.`;

  return { action, observation };
}
