import { StructuredTool, Tool } from 'langchain/tools';
import { execSync, ChildProcess } from 'child_process';
import fs from 'fs';
import { z } from 'zod';

export class GitCheckoutNewBranch extends StructuredTool {
  name = 'git-CheckoutNewBranch';
  description = `Create a new branch in a local repository. Please format your input as an object with the following parameters:
- "branch": (string) [REQUIRED] The name of the branch. Cannot contain wildcard characters
- "root": (string) [REQUIRED] The path to the root of the repository. Should always use /tmp/[repo]`;

  schema = z.object({
    branch: z.string(),
    root: z.string(),
  });

  async _call({ branch, root }: z.infer<typeof this.schema>) {
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

export class GitCloneRepository extends Tool {
  name = 'git-CloneRepository';
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

export class GitCheckoutBranch extends Tool {
  name = 'git-CheckoutBranch';
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
  name = 'git-AddFile';
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
  name = 'git-Status';
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
  name = 'git-Commit';
  description = `Record all files added to the staging area as changes to the repository. Please format your input as a message summarizing the word done for the commit`;
  async _call(input: string) {
    const out = execSync(`git commit -m "${input}"`).toString();
    if (out === 'nothing to commit, working tree clean') return out;
    return `Successfully committed changes.`;
  }
}

export class GitPushBranch extends Tool {
  name = 'git-PushBranch';
  description = `Push your local branch to the remote repository. Please format your input as the name of the branch to push.`;
  async _call(input: string) {
    execSync(`git push origin "${input}"`, { stdio: 'inherit' });
    return `Successfully pushed branch to remote repository.`;
  }
}

export class GitListBranches extends Tool {
  name = 'git-ListBranches';
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