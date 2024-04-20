import { execSync } from 'child_process';
import { Tool } from 'langchain/tools';

export class GitPullBranch extends Tool {
  name = 'git-PullBranch';
  description = `Pull a remote branch locally. Please format your input as the name of the branch to pull.`;
  async _call(input: string) {
    execSync(`git pull origin "${input}"`, { stdio: 'inherit' });
    return `Successfully pull remote branch to local directory.`;
  }
}
