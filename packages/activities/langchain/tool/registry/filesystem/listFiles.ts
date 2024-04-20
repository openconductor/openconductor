import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemListFilesTool extends StructuredTool {
  name = 'filesystem-ListFiles';
  description = `List the files in a directory. Please format your input as an object with the following parameters:
- "input": (string) [REQUIRED] The path to the directory, relative to your current directory.`;

  schema = z.object({
    input: z.string(),
  });

  async _call({ input }: z.infer<typeof this.schema>) {
    return `The files in the ${input} directory include: ${fs.readdirSync(input.trim(), 'utf8').join(', ')}`;
  }
}
