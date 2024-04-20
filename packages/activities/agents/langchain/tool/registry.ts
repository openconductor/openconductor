import { ReadFileTool, SerpAPI, Tool, WriteFileTool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { langchainVectorTool } from './registry/vectorstore';
import { NodeFileStore } from 'langchain/stores/file/node';
import {
  GitAddFile,
  GitCheckoutBranch,
  GitCheckoutNewBranch,
  GitCloneRepository,
  GitCommit,
  GitListBranches,
  GitPushBranch,
  GitStatus,
  GithubBranchGetTool,
  GithubCodeSearchTool,
  GithubIssueGetTool,
  GithubPullRequestCreateTool,
  ProcessChDir,
} from './registry/github';
import { FsInsertText, FsListFiles, FsReadFile, FsRemoveText } from './registry/filesystem';

export async function langchainToolRegistry(): Promise<Tool[]> {
  const vectorTool = langchainVectorTool({});

  const localStore = new NodeFileStore();
  const auth = process.env.GITHUB_API_TOKEN;

  const tools = [
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: 'Austin,Texas,United States',
    //   hl: 'en',
    //   gl: 'us',
    // }),
    new ReadFileTool({ store: localStore }),
    new WriteFileTool({ store: localStore }),
    new Calculator(),
    vectorTool,
    new GithubCodeSearchTool({ auth }),
    new GithubIssueGetTool({ auth }),
    new GithubPullRequestCreateTool({ auth }),
    new GithubBranchGetTool({ auth }),
    new GitCloneRepository(),
    new GitCheckoutNewBranch(),
    new GitCheckoutBranch(),
    new GitListBranches(),
    new GitStatus(),
    new GitAddFile(),
    new GitCommit(),
    new GitPushBranch(),
    new ProcessChDir(),
    new FsReadFile(),
    new FsInsertText(),
    new FsRemoveText(),
    new FsListFiles(),
  ];
  return tools as Tool[];
}
