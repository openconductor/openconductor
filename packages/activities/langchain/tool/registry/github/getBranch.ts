import { Octokit } from '@octokit/rest';
import { StructuredTool, Tool } from 'langchain/tools';
import { z } from 'zod';

export class GithubGetBranchTool extends StructuredTool {
  name = 'github-GetBranch';
  description = `Get a branch from a GitHub repository. Please format your input as an object with the following parameters:
  - "owner": (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
  - "repo": (string) [REQUIRED] The name of the repository. The name is not case sensitive.
  - "branch": (string) [REQUIRED] The name of the branch. Cannot contain wildcard characters`;

  schema = z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string(),
  });

  octokit: Octokit;
  constructor({ githubApiKey }: { githubApiKey?: string }) {
    super();
    this.octokit = new Octokit({
      auth: githubApiKey,
    });
  }
  async _call({ owner, repo, branch }: z.infer<typeof this.schema>) {
    return this.octokit.repos
      .getBranch({ owner, repo, branch })
      .then((res) => {
        const result = {
          name: res.data.name,
          commit: {
            sha: res.data.commit.sha,
          },
        };
        return JSON.stringify(result, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}
