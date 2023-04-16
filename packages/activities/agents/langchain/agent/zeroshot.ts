import { LLMChain, OpenAI } from 'langchain';
import { ZeroShotAgent } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models';

import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { AgentAction, AgentFinish, AgentStep } from 'langchain/schema';
import { langchainTool } from '../tool';

export async function langchainZeroShotAgent({
  input,
  steps = [],
  prefix = `Answer the following questions as best you can. You have access to the following tools:`,
  suffix = `Begin!`,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  input?: string;
  steps: AgentStep[];
  prefix?: string;
  suffix?: string;
  openAIApiKey?: string;
}): Promise<AgentAction | AgentFinish> {
  const tools = await langchainTool();

  const prompt = ZeroShotAgent.createPrompt(tools, {
    prefix,
    suffix,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessagePromptTemplate(prompt),
    HumanMessagePromptTemplate.fromTemplate(`{input}
This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
{agent_scratchpad}`),
  ]);

  const model = new OpenAI({
    temperature: 0,
    openAIApiKey,
  });

  const chat = new ChatOpenAI({
    temperature: 0,
    openAIApiKey,
  });

  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: model,
  });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  const agentPlan = agent.plan(steps, { input });

  return agentPlan;
}
