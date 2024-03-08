import { AgentActionOutputParser } from 'langchain/agents';
import { AgentAction, AgentFinish } from 'langchain/schema';

export class CustomOutputParser extends AgentActionOutputParser {
  async parse(text: string): Promise<AgentAction | AgentFinish> {
    console.log(`Received text: ${text}`);

    // Regex pattern to match content between ```json and ```
    const match = /```json\n([\s\S]+?)\n```/i.exec(text);

    if (!match) {
        throw new Error(`Could not parse LLM output: ${text}`);
    }
    
    const jsonContent = match[1]!.trim();

    // You can now parse the JSON content if required.
    let parsedJSON;
    try {
        parsedJSON = JSON.parse(jsonContent);
    } catch (error) {
        throw new Error(`Failed to parse extracted JSON content: ${jsonContent}`);
    }

    console.log('parsedJSON', parsedJSON)
    console.log('parsedJSON.name', parsedJSON[0].name)

    const parsed = {
      tool: parsedJSON[0].name,
      toolInput: parsedJSON[0].input,
      log: text,
    };

    console.log('parsed', parsed)

    return parsed
  }

  // async parse(text: string): Promise<AgentAction | AgentFinish> {
  //   console.log(`Received text: ${text}`);

  //   if (text.includes('End:')) {
  //     const parts = text.split('End:');
  //     const input = parts[parts.length - 1]!.trim();
  //     const finalAnswers = { output: input };
  //     return { log: text, returnValues: finalAnswers };
  //   }

  //   const match =
  //     /Action\s*:\s*(.*)\n?Action Input\s*:\s*([\s\S]*)/i.exec(text) ||
  //     /I have (?:found|gathered|successfully)(.*)\n(.*)/i.exec(text);

  //   if (!match) {
  //     throw new Error(`Could not parse LLM output: ${text}`);
  //   }

  //   const toolInput = match[2]!.trim().replace(/^`{3}|`{3}$/g, '');

  //   return {
  //     tool: match[1]!.trim(),
  //     toolInput,
  //     log: text,
  //   };
  // }

  getFormatInstructions(): string {
    throw new Error('Not implemented');
  }
}
