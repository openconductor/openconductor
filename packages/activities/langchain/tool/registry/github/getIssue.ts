import { Octokit } from '@octokit/rest';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class GithubGetIssueTool extends StructuredTool {
  name = 'github-GetIssue';
  description = `Get an issue from a GitHub repository. Please format your input as an object object with the following parameters:
- "owner": (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
- "repo": (string) [REQUIRED] The name of the repository. The name is not case sensitive.
- "issue_number": (number) [REQUIRED] The number that identifies the issue.`;

  schema = z.object({
    owner: z.string(),
    repo: z.string(),
    issue_number: z.number(),
  });

  octokit: Octokit;
  constructor({ githubApiKey }: { githubApiKey?: string }) {
    super();
    this.octokit = new Octokit({
      auth: githubApiKey,
    });
  }
  async _call({ owner, repo, issue_number }: z.infer<typeof this.schema>) {
    return this.octokit.issues
      .get({ owner, repo, issue_number })
      .then((res) => {
        const data = {
          title: res.data.title,
          body: res.data.body,
        };
        return JSON.stringify(data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}
