import { Tool } from 'langchain/tools';
import { Octokit } from '@octokit/rest';

export class GithubSearchTool extends Tool {
  name = 'github-Search';
  description = `Code search looks through the files hosted on GitHub. You can also filter the results:
- install repo:charles/privaterepo:	  Find all instances of install in code from the repository charles/privaterepo.
- shogun user:heroku:	  Find references to shogun from all public heroku repositories.
- join extension:coffee: 	Find all instances of join in code with coffee extension.
- system size:>1000:	  Find all instances of system in code of file size greater than 1000kbs.
- examples path:/docs/:	  Find all examples in the path /docs/.
- replace fork:true:	  Search replace in the source code of forks.`;

  octokit: Octokit;
  constructor({ githubApiKey }: { githubApiKey?: string }) {
    super();
    this.octokit = new Octokit({
      auth: githubApiKey,
    });
  }
  async _call(input: string) {
    return this.octokit.search
      .code({
        q: input,
      })
      .then((res) => {
        return JSON.stringify(res.data);
      });
  }
}
