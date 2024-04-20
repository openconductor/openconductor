import * as filesystemTool from './registry/filesystem';
import * as gitTool from './registry/git';
import * as githubTool from './registry/github';
import * as googleTool from './registry/google';
import * as vectorTool from './registry/vectorstore';
import { SerpAPI, StructuredTool, Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

export async function langchainToolRegistry(enabledPlugins?: string[]): Promise<Tool[]> {
  const githubApiKey = process.env.GITHUB_API_TOKEN;
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const googleCseId = process.env.GOOGLE_CSE_ID;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  const availableTools = [
    new googleTool.GoogleSearchTool({ googleCseId, googleApiKey }),
    new SerpAPI(serpApiKey, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),

    new Calculator(),

    vectorTool.vectorstoreSearchDocuments({ openAIApiKey }),

    new githubTool.GithubCreatePullRequestTool({ githubApiKey }),
    new githubTool.GithubGetBranchTool({ githubApiKey }),
    new githubTool.GithubGetIssueTool({ githubApiKey }),

    new gitTool.GitAddFile(),
    new gitTool.GitCheckoutBranch(),
    new gitTool.GitCloneRepository(),
    new gitTool.GitCommit(),
    new gitTool.GitListBranches(),
    new gitTool.GitPushBranch(),
    new gitTool.GitStatus(),

    new filesystemTool.FilesystemChangeDirectoryTool(),
    new filesystemTool.FilesystemCreateFileTool(),
    new filesystemTool.FilesystemInsertTextTool(),
    new filesystemTool.FilesystemListFilesTool(),
    new filesystemTool.FilesystemReadFileTool(),
    new filesystemTool.FilesystemRemoveTextTool(),
  ];

  const toolNameToInstance: Record<string, Tool | StructuredTool> = {};

  availableTools.forEach((tool) => {
    toolNameToInstance[tool.name] = tool;
  });

  if (!enabledPlugins) {
    return availableTools as Tool[];
  }
  const filteredTools = enabledPlugins?.map((plugin) => {
    const toolKey = Object.keys(toolNameToInstance).find((key) => key.startsWith(plugin));

    if (!toolKey) {
      throw new Error(`Tool for plugin '${plugin}' not found`);
    }

    const tool = toolNameToInstance[toolKey];
    return tool;
  });

  return filteredTools as Tool[];
}
