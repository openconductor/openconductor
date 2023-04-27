import { SerpAPI, Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import * as githubTool from './registry/github';
import * as gitTool from './registry/git';
import * as filesystemTool from './registry/filesystem';
import * as vectorTool from './registry/vectorstore';

export async function langchainToolRegistry(): Promise<Tool[]> {
  const githubApiKey = process.env.GITHUB_API_TOKEN;
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const serpApiKey = process.env.SERPAPI_API_KEY;

  const tools = [
    // new SerpAPI(serpApiKey, {
    //   location: 'Austin,Texas,United States',
    //   hl: 'en',
    //   gl: 'us',
    // }),

    // new Calculator(),

    vectorTool.vectorstoreSearchDocuments({ openAIApiKey }),

    // new githubTool.GithubCreatePullRequestTool({ githubApiKey }),
    // new githubTool.GithubGetBranchTool({ githubApiKey }),
    // new githubTool.GithubGetIssueTool({ githubApiKey }),

    // new gitTool.GitAddFile(),
    // new gitTool.GitCheckoutBranch(),
    // new gitTool.GitCloneRepository(),
    // new gitTool.GitCommit(),
    // new gitTool.GitListBranches(),
    // new gitTool.GitPushBranch(),
    // new gitTool.GitStatus(),

    // new filesystemTool.FilesystemChangeDirectoryTool(),
    // new filesystemTool.FilesystemCreateFileTool(),
    // new filesystemTool.FilesystemInsertTextTool(),
    // new filesystemTool.FilesystemListFilesTool(),
    // new filesystemTool.FilesystemReadFileTool(),
    // new filesystemTool.FilesystemRemoveTextTool(),
  ];
  return tools as Tool[];
}
