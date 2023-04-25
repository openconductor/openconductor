import { Tool } from 'langchain/tools';
import { Octokit } from '@octokit/rest';
import { execSync, ChildProcess } from 'child_process';
import fs from 'fs';

export class GithubCodeSearchTool extends Tool {
  name = 'Github Code Search';
  description = `Code search looks through the files hosted on GitHub. You can also filter the results:
- install repo:charles/privaterepo	  Find all instances of install in code from the repository charles/privaterepo.
- shogun user:heroku	  Find references to shogun from all public heroku repositories.
- join extension:coffee 	Find all instances of join in code with coffee extension.
- system size:>1000	  Find all instances of system in code of file size greater than 1000kbs.
- examples path:/docs/	  Find all examples in the path /docs/.
- replace fork:true	  Search replace in the source code of forks.`;
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

export class GithubIssueGetTool extends Tool {
  name = 'Github Issue Get';
  description = `Get an issue from a GitHub repository. Please format your input as a JSON object with the following parameters:
- owner: (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
- repo: (string) [REQUIRED] The name of the repository. The name is not case sensitive.
- issue_number: (number) [REQUIRED] The number that identifies the issue.`;
  octokit: Octokit;
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call(input: string) {
    return this.octokit.issues
      .get(JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, '')))
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}

export class GithubPullRequestCreateTool extends Tool {
  name = 'Github Pull Request Create';
  description = `Create a pull request. Please format your input as a JSON object with the following parameters:
- owner: (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
- repo: (string) [REQUIRED] The name of the repository. The name is not case sensitive.
- title: (string) [REQUIRED] The title of the new pull request. To close a GitHub issue with this pull request, include the keyword "Closes" followed by the issue number in the pull request's title.
- head: (string) [REQUIRED] The name of the branch where your changes are implemented. Make sure you have changes committed on a separate branch before you create a pull request.
- base: (string) [REQUIRED] The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
- body: (string) [OPTIONAL] The contents of the pull request.`;
  octokit: Octokit;
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call(input: string) {
    return this.octokit.pulls
      .create(JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, '')))
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}

export class GithubBranchGetTool extends Tool {
  name = 'Github Branch Get';
  description = `Get a branch from a GitHub repository. Please format your input as a JSON object with the following parameters:
  - owner: (string) [REQUIRED] The account owner of the repository. The name is not case sensitive.
  - repo: (string) [REQUIRED] The name of the repository. The name is not case sensitive.
  - branch: (string) [REQUIRED] The name of the branch. Cannot contain wildcard characters`;
  octokit: Octokit;
  constructor({ auth }: { auth?: string }) {
    super();
    this.octokit = new Octokit({
      auth,
    });
  }
  async _call(input: string) {
    return this.octokit.repos
      .getBranch(JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, '')))
      .then((res) => {
        return JSON.stringify(res.data, null, 2);
      })
      .catch((e) => {
        return JSON.stringify(e.response.data);
      });
  }
}

export class GitCloneRepository extends Tool {
  name = 'Git Clone Repository';
  description = `Clone a repository from GitHub into a new local directory. Please format your input as a url in the format https://github.com/[owner]/[repo].`;
  constructor() {
    super();
  }
  async _call(input: string) {
    const dir =
      // @ts-ignore
      input
        .split('/')
        .slice(-1)[0]
        .replace(/\.git$/, '');
    try {
      execSync(`git clone ${input}`);
      process.chdir(input);
      return `Cloned repository and changed current directory into ${dir}.`;
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        const err = e.stderr.toString();
        if (/^fatal: destination path '[^']+' already exists and is not an empty directory/.test(err)) {
          return `Directory ${dir} already exists. This is probably your cloned repository, change your current directory to it.`;
        }
        return err;
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}

export class GitCheckoutNewBranch extends Tool {
  name = 'Git Checkout New Branch';
  description = `Create a new branch in a local repository. Please format your input as a JSON object with the following parameters:
- branch: (string) [REQUIRED] The name of the branch. Cannot contain wildcard characters
- root: (string) [REQUIRED] The path to the root of the repository. Should always use /tmp/[repo]`;
  async _call(input: string) {
    const { branch, root } = JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, ''));
    if (!fs.existsSync(root)) {
      return `Directory ${root} does not exist. Please clone the repository first.`;
    }
    if (process.cwd() !== root) {
      process.chdir(root);
    }
    try {
      const result = execSync(`git checkout -b ${branch}`);
      return result.toString();
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        return e.stderr.toString();
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}

export class GitCheckoutBranch extends Tool {
  name = 'Git Checkout Branch';
  description = `Switch to a branch in a local repository. This command does not switch your current working directory. Please format your input as a string representing just the branch name.`;
  async _call(input: string) {
    try {
      const result = execSync(`git checkout ${input}`);
      return result.toString();
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        return e.stderr.toString();
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}

export class GitAddFile extends Tool {
  name = 'Git Add File';
  description = `Add file contents to be staged for a commit. Please format your input as a path to the file, relative to the current directory.`;
  async _call(input: string) {
    try {
      execSync(`git add ${input}`);
      return `Successfully added ${input} to the staging area.`;
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        return e.stderr.toString();
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}

export class GitStatus extends Tool {
  name = 'Git Status';
  description = `View all of the changes made to the repository since the last commit. The only acceptable input is "status".`;
  async _call(input: string) {
    try {
      return execSync(`git status`).toString();
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        return e.stderr.toString();
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}

export class GitCommit extends Tool {
  name = 'Git Commit';
  description = `Record all files added to the staging area as changes to the repository. Please format your input as a message summarizing the word done for the commit`;
  async _call(input: string) {
    const out = execSync(`git commit -m "${input}"`).toString();
    if (out === 'nothing to commit, working tree clean') return out;
    return `Successfully committed changes.`;
  }
}

export class GitPushBranch extends Tool {
  name = 'Git Push Branch';
  description = `Push your local branch to the remote repository. Please format your input as the name of the branch to push.`;
  async _call(input: string) {
    execSync(`git push origin "${input}"`, { stdio: 'inherit' });
    return `Successfully pushed branch to remote repository.`;
  }
}

export class GitListBranches extends Tool {
  name = 'Git List Branches';
  description = `List the branches in your local repository. The only acceptable input is the word "list".`;
  async _call(_input: string) {
    const result = execSync(`git branch`).toString();
    const branches = result.split('\n').map((b) => b.trim());
    const currentIndex = branches.findIndex((b) => b.startsWith('*'));
    // @ts-ignore
    branches[currentIndex] = branches[currentIndex].replace(/^\*\s*/, '');
    const current = branches[currentIndex];
    return `You're currently on branch ${current}. The following branches are available:\n${branches.join('\n')}`;
  }
}
