import { Tool } from 'langchain/tools';
import { execSync } from 'child_process';

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
