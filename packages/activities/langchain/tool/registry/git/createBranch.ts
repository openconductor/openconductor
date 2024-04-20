import { execSync, ChildProcess } from 'child_process';
import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import * as path from 'path';
import { z } from 'zod';

export class GitCreateBranch extends StructuredTool {
  name = 'git-CreateBranch';
  description = `Create a new branch in a local repository. Please format your input as an object with the following parameters:
- "branch": (string) [REQUIRED] The name of the branch. Cannot contain wildcard characters
- "path": (string) [REQUIRED] The path to the local repository relative to your current working directory.`;

  schema = z.object({
    branch: z.string(),
    path: z.string(),
  });

  async _call({ branch, path }: z.infer<typeof this.schema>) {
    if (!fs.existsSync(path)) {
      return `Directory ${path} does not exist. Please clone the repository first.`;
    }
    if (process.cwd() !== path) {
      process.chdir(path);
    }
    try {
      execSync(`git fetch`);
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
