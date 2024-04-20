import { StructuredTool } from 'langchain/tools';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

export class GithubCreatePullRequestTool extends StructuredTool {
  name = 'github-CreatePullRequest';
  description = `Create a pull request. Please format your input as an object with the following parameters:
- "owner": (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
- "repo": (string) [REQUIRED] The name of the repository. The name is not case sensitive.
- "title": (string) [REQUIRED] The title of the new pull request. To close a GitHub issue with this pull request, include the keyword "Closes" followed by the issue number in the pull request's title.
- "head": (string) [REQUIRED] The name of the branch where your changes are implemented. Make sure you have changes committed on a separate branch before you create a pull request.
- "base": (string) [REQUIRED] The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
- "body": (string) [OPTIONAL] The contents of the pull request.`;

  schema = z.object({
    owner: z.string(),
    repo: z.string(),
    title: z.string(),
    head: z.string(),
    base: z.string(),
    body: z.string().optional(),
  });

  octokit: Octokit;
  constructor({ githubApiKey }: { githubApiKey?: string }) {
    super();
    this.octokit = new Octokit({
      auth: githubApiKey,
    });
  }
  async _call({ owner, repo, title, head, base, body }: z.infer<typeof this.schema>) {
    return this.octokit.pulls
      .create({ owner, repo, title, head, base, body })
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}
