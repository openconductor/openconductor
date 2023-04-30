import { execSync } from 'child_process';
import * as fs from 'fs';
import { Tool } from 'langchain/tools';
import * as path from 'path';

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
    const currentDir = process.cwd();
    const tmpDir = path.join(currentDir, 'tmp', dir);

    if (!fs.existsSync(path.join(currentDir, 'tmp'))) {
      fs.mkdirSync(path.join(currentDir, 'tmp'));
    }

    try {
      execSync(`git clone ${input} ${tmpDir}`);
      process.chdir(tmpDir);
      return `Cloned repository ${input} and changed current directory to ${tmpDir}.`;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return `Directory ${tmpDir} already exists. This is probably your cloned repository, change your current directory to it.`;
        }
        return error.message;
      }
      return 'Unknown error occurred.';
    }
  }
}
