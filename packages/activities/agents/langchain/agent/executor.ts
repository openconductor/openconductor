import { Context } from '@temporalio/activity';
import { LLMChain, OpenAI } from 'langchain';
import { AgentExecutor, ZeroShotAgent } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChainValues } from 'langchain/dist/schema';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { langchainVectorTool } from '../tool/registry/vectorstore';
import { CallbackManager, ConsoleCallbackHandler } from 'langchain/callbacks';

export async function langchainAgentExecutor({
  query,
  prefix = `Answer the following questions as best you can. You have access to the following tools:`,
  suffix = `Begin!`,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  query: string;
  prefix?: string;
  suffix?: string;
  openAIApiKey?: string;
}): Promise<ChainValues | boolean> {
  const callbackManager = new CallbackManager();
  callbackManager.addHandler(new ConsoleCallbackHandler());

  const model = new OpenAI({
    temperature: 0,
    openAIApiKey,
    callbackManager,
  });

  const vectorTool = langchainVectorTool({});

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
    vectorTool,
  ];

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

  const chat = new ChatOpenAI({
    temperature: 0,
    openAIApiKey,
    callbackManager,
  });

  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
    callbackManager,
  });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  const executor = AgentExecutor.fromAgentAndTools({ agent, tools, callbackManager });

  const result = await executor.call({ input: query, callbackManager });

  Context.current().heartbeat({ intermediateStep: result.intermediateSteps });

  console.log('result.intermediateSteps', result.intermediateSteps);

  if (result.output) {
    return result;
  } else {
    return false;
  }
}
