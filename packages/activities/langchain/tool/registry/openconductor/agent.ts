import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class OpenconductorAgent extends StructuredTool {
  name = 'openconductor-GetAgent';
  description = `Create an AI agent to execute a task. Please format your input as an object with the following parameters:
- "prompt": (string) [REQUIRED] The instruction to be given.`;

  schema = z.object({
    prompt: z.string(),
  });

  async _call({ prompt }: z.infer<typeof this.schema>) {
    return 'test';
  }
}
