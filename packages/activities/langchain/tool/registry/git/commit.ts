import { Tool } from 'langchain/tools';
import { execSync } from 'child_process';

export class GitCommit extends Tool {
  name = 'git-Commit';
  description = `Record all files added to the staging area as changes to the repository. Please format your input as a message summarizing the word done for the commit`;
  async _call(input: string) {
    const out = execSync(`git commit -m "${input}"`).toString();
    if (out === 'nothing to commit, working tree clean') return out;
    return `Successfully committed changes.`;
  }
}
