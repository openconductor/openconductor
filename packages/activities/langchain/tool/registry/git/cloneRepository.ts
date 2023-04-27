import { Tool } from 'langchain/tools';
import { execSync, ChildProcess } from 'child_process';

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
    try {
      execSync(`git clone ${input}`);
      process.chdir(input);
      return `Cloned repository and changed current directory into ${dir}.`;
    } catch (e) {
      if (e instanceof ChildProcess && e.stderr) {
        const err = e.stderr.toString();
        if (/^fatal: destination path '[^']+' already exists and is not an empty directory/.test(err)) {
          return `Directory ${dir} already exists. This is probably your cloned repository, change your current directory to it.`;
        }
        return err;
      } else if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred.';
    }
  }
}
