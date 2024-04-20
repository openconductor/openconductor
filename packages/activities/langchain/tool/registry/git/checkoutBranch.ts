import { Tool } from 'langchain/tools';
import { execSync, ChildProcess } from 'child_process';

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
