import { renderTemplate } from 'langchain/prompts';

export async function langchainPromptTemplate({ prompt, input }: { prompt: string; input: Record<string, any> }) {
  const renderedTemplate = renderTemplate(prompt, 'f-string', input);

  return renderedTemplate;
}
