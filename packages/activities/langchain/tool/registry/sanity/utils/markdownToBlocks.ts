import { marked } from 'marked';

export async function markdownToBlocks(requestBody: { markdown: string; heading: string }) {
  const lexer = new marked.Lexer({});
  const tokens = lexer.lex(requestBody.markdown.toString());

  const sanityBlocks: any = tokens.map((token) => {
    if (token.type === 'heading') {
      return {
        style: requestBody.heading,
        text: token.text,
      };
    } else {
      return {
        style: 'span',
        text: token.raw,
      };
    }
  });
  return sanityBlocks;
}
