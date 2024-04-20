import { execSync } from 'child_process';
import * as fs from 'fs';
import { Tool } from 'langchain/tools';
import * as path from 'path';

export class GitInitRepository extends Tool {
  name = 'git-InitRepository';
  description = `Initialise a git repository.`;
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

    process.chdir(tmpDir);
    execSync(`git init`);
    return `Change directory to ${dir} and initialised git repository ${input}.`;
  }
}
