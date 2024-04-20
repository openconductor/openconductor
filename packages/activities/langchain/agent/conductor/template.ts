import { RegistryTool } from '../../tool/registry';
import { Instructions } from './instructions';
import {
  BaseChatPromptTemplate,
  BasePromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate,
} from 'langchain/prompts';
import { AgentStep, BaseChatMessage, HumanChatMessage, InputValues, PartialValues } from 'langchain/schema';

export class ConductorPromptTemplate extends BaseChatPromptTemplate {
  tools: RegistryTool[];

  constructor(args: { tools: RegistryTool[]; inputVariables: string[] }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType(): string {
    throw new Error('Not implemented');
  }

  async formatMessages(values: InputValues): Promise<BaseChatMessage[]> {
    /** Construct the final template */
    const toolStrings = this.tools.map((tool) => `${tool.name}: ${tool.description}`).join('\n');
    const toolNames = this.tools.map((tool) => tool.name).join('\n');

    const newInstructions = new Instructions();
    const { prefix, instructions, suffix } = newInstructions.format(toolNames);

    const template = [prefix, toolStrings, instructions, suffix].join('\n\n');

    // /** Construct the agent_scratchpad */
    // const intermediateSteps = values.intermediate_steps as AgentStep[];
    // const agentScratchpad = intermediateSteps.reduce(
    //   (thoughts, { action, observation }) =>
    //     thoughts + [action.log, `\nObservation: ${observation}`, 'Thought:'].join('\n'),
    //   '',
    // );
    // const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */

    const formatted = renderTemplate(template, 'f-string', values);

    return [new HumanChatMessage(formatted)];
  }

  partial(_values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error('Not implemented');
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error('Not implemented');
  }
}
