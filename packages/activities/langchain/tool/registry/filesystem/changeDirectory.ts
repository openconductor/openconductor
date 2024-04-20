import fs from 'fs';
import path from 'path';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemChangeDirectoryTool extends StructuredTool {
  name = 'filesystem-ChangeDirectory';
  description = `Change your current working directory. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the directory relative to your current working directory.`;

  schema = z.object({
    path: z.string(),
  });

  async _call({ path: filePath }: z.infer<typeof this.schema>) {
    // Check if the directory exists and create it if it doesn't
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    process.chdir(filePath);
    return `Changed current directory to ${filePath}.`;
  }
}
