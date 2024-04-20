import { Document } from 'langchain/document';
import { GithubRepoLoaderParams, GithubRepoLoader } from 'langchain/document_loaders/web/github';

export async function langchainLoaderGithub({
  repoUrl,
  options,
}: {
  repoUrl: string;
  options?: GithubRepoLoaderParams;
}): Promise<Document[]> {
  const defaultOptions: GithubRepoLoaderParams = {
    accessToken: process.env.GITHUB_API_TOKEN,
  };

  const loader = new GithubRepoLoader(repoUrl, {
    ...defaultOptions,
    ...options,
  });
  const docs = await loader.load();
  return docs;
}
