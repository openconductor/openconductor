import * as filesystemTool from './registry/filesystem';
import * as gitTool from './registry/git';
import * as githubTool from './registry/github';
import * as googleTool from './registry/google';
import * as openaiTool from './registry/openai';
import * as openconductorTool from './registry/openconductor';
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
    new openconductorTool.OpenconductorDatetime(),
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
    new gitTool.GitCreateBranch(),
    new gitTool.GitCloneRepository(),
    new gitTool.GitInitRepository(),
    new gitTool.GitCommit(),
    new gitTool.GitListBranches(),
    new gitTool.GitPushBranch(),
    new gitTool.GitStatus(),

    new filesystemTool.FilesystemChangeDirectoryTool(),
    new filesystemTool.FilesystemCreateFileTool(),
    new filesystemTool.FilesystemInsertContentTool(),
    new filesystemTool.FilesystemListFilesTool(),
    new filesystemTool.FilesystemReadFileTool(),
    new filesystemTool.FilesystemRemoveContentTool(),

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
