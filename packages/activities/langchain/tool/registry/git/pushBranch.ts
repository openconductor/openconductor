import { Tool } from 'langchain/tools';
import { execSync } from 'child_process';

export class GitPushBranch extends Tool {
  name = 'git-PushBranch';
  description = `Push your local branch to the remote repository. Please format your input as the name of the branch to push.`;
  async _call(input: string) {
    execSync(`git push origin "${input}"`, { stdio: 'inherit' });
    return `Successfully pushed branch to remote repository.`;
  }
}
