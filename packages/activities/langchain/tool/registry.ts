import { getDbAccount } from '../../db/getAccount';
import * as filesystemTool from './registry/filesystem';
import * as gitTool from './registry/git';
import * as githubTool from './registry/github';
import * as googleTool from './registry/google';
import * as openaiTool from './registry/openai';
import * as openconductorTool from './registry/openconductor';
import * as vectorTool from './registry/vectorstore';
import { SerpAPI, StructuredTool, Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

export type RegistryTool = {
  name: string;
  description: string;
};

export async function langchainToolRegistry({
  userId,
  enabledPlugins,
}: {
  userId: string;
  enabledPlugins?: string[];
}): Promise<Tool[]> {
  const githubApiKey = process.env.GITHUB_API_TOKEN;
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const googleCseId = process.env.GOOGLE_CSE_ID;
  const googleApiKey = process.env.GOOGLE_API_KEY;
  let googleRefreshToken = '';
  try {
    const { refresh_token } = await getDbAccount({
      userId,
      provider: 'google',
    });
    if (refresh_token) googleRefreshToken = refresh_token;
  } catch (error) {
    console.log('no googleRefreshToken');
  }

  const availableTools = [
    new openconductorTool.OpenconductorDatetime(),
    // new googleTool.GoogleSearchTool({ googleCseId, googleApiKey }),
    // // new googleTool.GoogleWebmastersTool({ googleRefreshToken }),
    // new SerpAPI(serpApiKey, {
    //   location: 'Austin,Texas,United States',
    //   hl: 'en',
    //   gl: 'us',
    // }),

    // new Calculator(),

    // vectorTool.vectorstoreSearchDocuments({ openAIApiKey }),

    // new githubTool.GithubCreatePullRequestTool({ githubApiKey }),
    // new githubTool.GithubGetBranchTool({ githubApiKey }),
    // new githubTool.GithubGetIssueTool({ githubApiKey }),

    // new gitTool.GitAddFile(),
    // new gitTool.GitCheckoutBranch(),
    // new gitTool.GitCreateBranch(),
    // new gitTool.GitCloneRepository(),
    // new gitTool.GitInitRepository(),
    // new gitTool.GitCommit(),
    // new gitTool.GitListBranches(),
    // new gitTool.GitPushBranch(),
    // new gitTool.GitPullBranch(),
    // new gitTool.GitStatus(),

    // new filesystemTool.FilesystemChangeDirectoryTool(),
    // new filesystemTool.FilesystemCreateFileTool(),
    // new filesystemTool.FilesystemInsertContentTool(),
    // new filesystemTool.FilesystemListFilesTool(),
    // new filesystemTool.FilesystemReadFileTool(),
    // new filesystemTool.FilesystemRemoveContentTool(),

    new openaiTool.OpenaiPromptGpt({ openAIApiKey }),
  ];

  const toolNameToInstance: Record<string, Tool | StructuredTool> = {};

  availableTools.forEach((tool) => {
    toolNameToInstance[tool.name] = tool;
  });

  if (!enabledPlugins) {
    return availableTools as Tool[];
  }

  const filteredTools = enabledPlugins.flatMap((plugin) => {
    const toolKeys = Object.keys(toolNameToInstance).filter((key) => key.startsWith(plugin));

    if (toolKeys.length === 0) {
      throw new Error(`Tools for plugin '${plugin}' not found`);
    }

    const tools = toolKeys.map((toolKey) => toolNameToInstance[toolKey]);
    return tools;
  });

  return filteredTools as Tool[];
}

export async function langchainTools({
  userId,
  enabledPlugins,
}: {
  userId: string;
  enabledPlugins?: string[];
}): Promise<RegistryTool[]> {
  const availableTools = await langchainToolRegistry({ userId });

  const filteredTools = availableTools
    .filter((tool) => enabledPlugins?.some((plugin) => tool.name.startsWith(plugin)))
    .map((tool) => ({ name: tool.name, description: tool.description }));

  return filteredTools;
}
