import { StructuredTool, Tool } from 'langchain/tools';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

export class GithubCodeSearchTool extends Tool {
  name = 'github-CodeSearch';
  description = `Code search looks through the files hosted on GitHub. You can also filter the results:
- install repo:charles/privaterepo:	  Find all instances of install in code from the repository charles/privaterepo.
- shogun user:heroku:	  Find references to shogun from all public heroku repositories.
- join extension:coffee: 	Find all instances of join in code with coffee extension.
- system size:>1000:	  Find all instances of system in code of file size greater than 1000kbs.
- examples path:/docs/:	  Find all examples in the path /docs/.
- replace fork:true:	  Search replace in the source code of forks.`;

  octokit: Octokit;
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call(input: string) {
    return this.octokit.search
      .code({
        q: input,
      })
      .then((res) => {
        return JSON.stringify(res.data);
      });
  }
}

export class GithubIssueGetTool extends StructuredTool {
  name = 'github-IssueGet';
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
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call({ owner, repo, issue_number }: z.infer<typeof this.schema>) {
    return this.octokit.issues
      .get({ owner, repo, issue_number })
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}

export class GithubPullRequestCreateTool extends StructuredTool {
  name = 'github-PullRequestCreate';
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
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
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

export class GithubBranchGetTool extends StructuredTool {
  name = 'github-BranchGet';
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
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call({ owner, repo, branch }: z.infer<typeof this.schema>) {
    return this.octokit.repos
      .getBranch({ owner, repo, branch })
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}
