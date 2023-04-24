import { OpenAI } from 'langchain';
import { initializeAgentExecutor } from 'langchain/agents';

import { PromptTemplate } from 'langchain/prompts';
import { ChainValues } from 'langchain/schema';
import { langchainToolRegistry } from '../tool/registry';
// import { z } from 'zod';

export async function langchainGithubAgent({
  repo_full,
  issue,
  owner,
  repo,
  type,
  openAIApiKey = process.env.OPENAI_API_KEY,
}: {
  repo_full: string;
  issue?: string;
  owner?: string;
  repo?: string;
  type?: string;
  openAIApiKey?: string;
}): Promise<ChainValues> {
  // const zArgs = z.object({
  //   issue: z.number(),
  //   owner: z.string(),
  //   repo: z.string(),
  //   type: z.literal('User').or(z.literal('Organization')),
  // });

  const template =
    'You are an engineer working on the GitHub repository: {repo_full}. You have just been assigned to issue {issue}. Create a pull request that will close this issue.';
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ['repo_full', 'issue', 'title', 'body'],
  });
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', openAIApiKey });
  // const chain = new LLMChain({ llm: model, prompt: prompt });

  // const { issue, repo, owner, type } = zArgs.parse(evt);
  // TODO - need to refresh token if it's expired
  // const auth = await getInstallationToken(type, owner);
  process.chdir('/tmp');

  const tools = await langchainToolRegistry();

  const executor = await initializeAgentExecutor(tools, model, 'zero-shot-react-description', true);
  console.log('loaded executor');
  const input = await prompt.format({
    repo_full: `${owner}/${repo}`,
    issue: issue,
  });
  console.log('Ready to call');

  const call = await executor.call({ input });
  return call;
}
