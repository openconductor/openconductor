import { Tool } from 'langchain/tools';
import { execSync, ChildProcess } from 'child_process';

export class GitStatus extends Tool {
  name = 'git-Status';
  description = `View all of the changes made to the repository since the last commit. The only acceptable input is "status".`;
  async _call() {
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
