import { ReadFileTool, SerpAPI, Tool, WriteFileTool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { langchainVectorTool } from './registry/vectorstore';
import { NodeFileStore } from 'langchain/stores/file/node';
import {
  GithubBranchGetTool,
  GithubCodeSearchTool,
  GithubIssueGetTool,
  GithubPullRequestCreateTool,
} from './registry/github';
import {
  GitAddFile,
  GitCheckoutBranch,
  GitCheckoutNewBranch,
  GitCloneRepository,
  GitCommit,
  GitListBranches,
  GitPushBranch,
  GitStatus,
} from './registry/git';
import {
  FilesystemCreateFileTool,
  FilesystemInsertTextTool,
  FilesystemListFilesTool,
  FilesystemReadFileTool,
  FilesystemRemoveTextTool,
  ProcessChangeDirectoryTool,
} from './registry/filesystem';

export async function langchainToolRegistry(): Promise<Tool[]> {
  const vectorTool = langchainVectorTool({});

  // const localStore = new NodeFileStore();
  const auth = process.env.GITHUB_API_TOKEN;

  const tools = [
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: 'Austin,Texas,United States',
    //   hl: 'en',
    //   gl: 'us',
    // }),
    // new ReadFileTool({ store: localStore }),
    // new WriteFileTool({ store: localStore }),
    // new Calculator(),
    vectorTool,
    // new GithubCodeSearchTool({ auth }),
    // new GithubIssueGetTool({ auth }),
    // new GithubPullRequestCreateTool({ auth }),
    // new GithubBranchGetTool({ auth }),
    // new GitCloneRepository(),
    // new GitCheckoutNewBranch(),
    // new GitCheckoutBranch(),
    // new GitListBranches(),
    // new GitStatus(),
    // new GitAddFile(),
    // new GitCommit(),
    // new GitPushBranch(),
    new ProcessChangeDirectoryTool(),
    new FilesystemCreateFileTool(),
    new FilesystemReadFileTool(),
    new FilesystemInsertTextTool(),
    new FilesystemRemoveTextTool(),
    new FilesystemListFilesTool(),
  ];
  return tools as Tool[];
}
