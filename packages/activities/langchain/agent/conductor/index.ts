import { RegistryTool, langchainToolRegistry } from '../../tool/registry';
import { CustomOutputParser } from '../parser';
import { PLANNER_CHAT_PROMPT } from './instructions';
import { ConductorOutputParser } from './parser';
import { ConductorPromptTemplate } from './template';
import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PlanAndExecuteAgentExecutor } from 'langchain/experimental/plan_and_execute';
import { AgentAction, AgentFinish, AgentStep, ChainValues } from 'langchain/schema';

export async function langchainAgentConductor({
  input,
  tools,
  openAIApiKey = process.env.OPENAI_API_KEY,
  userId,
}: {
  input?: string;
  tools: RegistryTool[];
  openAIApiKey?: string;
  userId: string;
}): Promise<ChainValues> {
  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey,
  });

  // const planner = PlanAndExecuteAgentExecutor.getDefaultPlanner({ llm: model });
  // console.log('planner', planner);

  // const plan = await planner.plan(inputs.input, runManager?.getChild());
  // if (!plan.steps?.length) {
  //   throw new Error('Could not create and parse a plan to answer your question - please try again.');
  // }

  // return executor;

  const prompt = new ConductorPromptTemplate({
    tools,
    inputVariables: ['input'],
  });

  const llmChain = new LLMChain({
    prompt,
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
  });

  const executor = new AgentExecutor({
    agent,
    tools: await langchainToolRegistry({ userId }),
  });

  console.log('executor', executor);

  const result = await executor.call({ input });

  console.log('result', result);

  return result;
}
