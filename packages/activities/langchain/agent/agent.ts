import { RegistryTool, langchainToolRegistry } from '../tool/registry';
import { CustomOutputParser } from './parser';
import { CustomPromptTemplate } from './template';
import { LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { AgentAction, AgentFinish, AgentStep } from 'langchain/schema';

export async function langchainAgent({
  input,
  steps = [],
  tools,
  openAIApiKey = process.env.OPENAI_API_KEY,
  userId,
}: {
  input?: string;
  steps: AgentStep[];
  tools: RegistryTool[];
  openAIApiKey?: string;
  userId: string;
}): Promise<AgentAction | AgentFinish> {
  const model = new ChatOpenAI({ temperature: 0, openAIApiKey });

  const prompt = new CustomPromptTemplate({
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
