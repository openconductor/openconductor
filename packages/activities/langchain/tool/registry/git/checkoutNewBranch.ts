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
