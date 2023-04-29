import fs from 'fs';
import path from 'path';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemCreateFileTool extends StructuredTool {
  name = 'filesystem-CreateFile';
  description = `Create a file with the specified content. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the file to create, relative to your current directory.
- "text": (string) [OPTIONAL] The content of the file.`;

  schema = z.object({
    path: z.string(),
    text: z.string().optional(),
  });

  async _call({ path: filePath, text = '' }: z.infer<typeof this.schema>) {
    // Check if the directory exists and create it if it doesn't
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Create the file with the specified content
    fs.writeFileSync(filePath, text);
    return `Successfully created file ${filePath} with the given content.`;
  }
}
