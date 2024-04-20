import { ReadFileTool, SerpAPI, Tool, WriteFileTool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { langchainVectorTool } from './registry/vectorstore';
import { NodeFileStore } from 'langchain/stores/file/node';

export async function langchainToolRegistry(): Promise<Tool[]> {
  const vectorTool = langchainVectorTool({});

  const store = new NodeFileStore();

  const tools = [
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: 'Austin,Texas,United States',
    //   hl: 'en',
    //   gl: 'us',
    // }),
    new ReadFileTool({ store }),
    new WriteFileTool({ store }),
    new Calculator(),
    vectorTool,
  ];

  return tools as Tool[];
}
