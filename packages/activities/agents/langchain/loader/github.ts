import { Document } from 'langchain/document';
import { GithubRepoLoaderParams, GithubRepoLoader } from 'langchain/document_loaders';

export async function langchainLoaderGithub({
  repoUrl,
  options,
}: {
  repoUrl: string;
  options?: GithubRepoLoaderParams;
}): Promise<Document[]> {
  const loader = new GithubRepoLoader(repoUrl, options);
  const docs = await loader.load();
  return docs;
}
