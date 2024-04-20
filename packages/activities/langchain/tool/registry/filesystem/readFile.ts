import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemReadFileTool extends StructuredTool {
  name = 'filesystem-ReadFile';
  description = `Read a file from the filesystem. Please format your input as an object with the following parameters:
- "input": (string) [REQUIRED] The path to the file, relative to your current directory.`;

  schema = z.object({
    input: z.string(),
  });

  async _call({ input }: z.infer<typeof this.schema>) {
    return fs.readFileSync(input.trim(), 'utf8');
  }
}
