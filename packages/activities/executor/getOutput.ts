import { Agent } from 'langchain/agents';
import { AgentFinish, AgentStep } from 'langchain/schema';

export async function getOutput({
  agent,
  returnIntermediateSteps,
  steps,
  finishStep,
}: {
  agent: Agent;
  returnIntermediateSteps?: boolean;
  steps: AgentStep[];
  finishStep: AgentFinish;
}): Promise<
  | {
      intermediateSteps: AgentStep[];
    }
  | {
      [x: string]: any;
    }
> {
  const { returnValues } = finishStep;
  const additional = await agent.prepareForOutput(returnValues, steps);

  if (returnIntermediateSteps) {
    return { ...returnValues, intermediateSteps: steps, ...additional };
  }

  return { ...returnValues, ...additional };
}
