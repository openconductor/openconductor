import {
  BaseChatPromptTemplate,
  BasePromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate,
} from 'langchain/prompts';
import { AgentStep, BaseChatMessage, HumanChatMessage, InputValues, PartialValues } from 'langchain/schema';
import { Tool } from 'langchain/tools';

export class CustomPromptTemplate extends BaseChatPromptTemplate {
  tools: Tool[];

  constructor(args: { tools: Tool[]; inputVariables: string[] }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType(): string {
    throw new Error('Not implemented');
  }

  async formatMessages(values: InputValues): Promise<BaseChatMessage[]> {
    const PREFIX = `Execute the following task as best you can. You have access to the following tools:`;
    const formatInstructions = (toolNames: string) => `Use the following format:

Task: the input task you must finish
Thought: you should always think about what to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I have finished the task
End: the result of the original input task`;
    const SUFFIX = `Begin!

Task: {input}
Thought:{agent_scratchpad}`;

    /** Construct the final template */
    const toolStrings = this.tools.map((tool) => `${tool.name}: ${tool.description}`).join('\n');
    const toolNames = this.tools.map((tool) => tool.name).join('\n');

    const instructions = formatInstructions(toolNames);

    const template = [PREFIX, toolStrings, instructions, SUFFIX].join('\n\n');
    /** Construct the agent_scratchpad */
    const intermediateSteps = values.intermediate_steps as AgentStep[];
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts + [action.log, `\nObservation: ${observation}`, 'Thought:'].join('\n'),
      '',
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */

    const formatted = renderTemplate(template, 'f-string', newInput);
    console.log('formatted', formatted);
    return [new HumanChatMessage(formatted)];
  }

  partial(_values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error('Not implemented');
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error('Not implemented');
  }
}
