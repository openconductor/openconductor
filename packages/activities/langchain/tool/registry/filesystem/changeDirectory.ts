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
    // Resolve the absolute path for the given filePath
    const resolvedPath = path.resolve(filePath);

    // Check if the resolved directory exists, and create it if it doesn't
    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    } else {
      // Check if the resolved path is a directory
      const stats = fs.statSync(resolvedPath);
      if (!stats.isDirectory()) {
        throw new Error(`The path "${resolvedPath}" is not a directory.`);
      }
    }

    process.chdir(resolvedPath);
    return `Changed current directory to ${resolvedPath}.`;
  }
}
