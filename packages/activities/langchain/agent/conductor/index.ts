import { langchainToolRegistry } from '../../tool/registry';
import { CustomOutputParser } from '../parser';
import { ConductorPromptTemplate } from './template';
import { LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { AgentAction, AgentFinish, AgentStep } from 'langchain/schema';

export async function langchainAgentConductor({
  input,
  steps,
  enabledPlugins,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  input?: string;
  steps: AgentStep[];
  enabledPlugins?: string[];
  openAIApiKey?: string;
}): Promise<AgentAction | AgentFinish> {
  const model = new ChatOpenAI({ temperature: 0, openAIApiKey });

  const tools = await langchainToolRegistry(enabledPlugins);

  const prompt = new ConductorPromptTemplate({
    tools,
    inputVariables: ['input', 'agent_scratchpad'],
  });

  const llmChain = new LLMChain({
    prompt,
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: ['\nObservation'],
  });

  const agentPlan = agent.plan(steps, { input });

  return agentPlan;
}
