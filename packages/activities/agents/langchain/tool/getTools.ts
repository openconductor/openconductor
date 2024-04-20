import { SerpAPI, Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { langchainVectorTool } from '../vectorstore/tool';

export async function langchainTool(): Promise<Tool[]> {
  const vectorTool = langchainVectorTool({});

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
    vectorTool,
  ];

  return tools;
}
