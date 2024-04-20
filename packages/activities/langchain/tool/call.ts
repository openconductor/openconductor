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

export async function langchainToolCall({ action, userId }: { action: AgentAction; userId: string }): Promise<{
  action: AgentAction;
  observation: string;
}> {
  const tools = await langchainToolRegistry({ userId });
  const toolsByName = Object.fromEntries(tools.map((t) => [t.name.toLowerCase(), t]));

  const tool = toolsByName[action.tool?.toLowerCase()];

  const toolInput = isJsonString(action.toolInput) ? JSON.parse(action.toolInput) : action.toolInput;

  let observation = '';

  if (!tool) {
    observation = `${action.tool} is not a valid tool, try another one.`;
  }

  try {
    observation = await tool!.call(toolInput);
  } catch (error: any) {
    console.log('error', error);
    observation = error.message;
  }

  return { action, observation };
}
