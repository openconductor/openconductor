import { AgentActionOutputParser } from 'langchain/agents';
import { AgentAction, AgentFinish } from 'langchain/schema';

export class CustomOutputParser extends AgentActionOutputParser {
  async parse(text: string): Promise<AgentAction | AgentFinish> {
    console.log(`Received text: ${text}`);

    if (text.includes('End:')) {
      const parts = text.split('End:');
      const input = parts[parts.length - 1]!.trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match =
      /Action\s*:\s*(.*)\n?Action Input\s*:\s*([\s\S]*)/i.exec(text) ||
      /I have (?:found|gathered|successfully)(.*)\n(.*)/i.exec(text);

    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    const toolInput = match[2]!.trim().replace(/^`{3}|`{3}$/g, '');

    return {
      tool: match[1]!.trim(),
      toolInput,
      log: text,
    };
  }

  getFormatInstructions(): string {
    throw new Error('Not implemented');
  }
}
