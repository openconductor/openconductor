import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import path from 'path';
import { z } from 'zod';

export class FilesystemCreateFileTool extends StructuredTool {
  name = 'filesystem-CreateFile';
  description = `Create a new file with the specified content if needed. Please format your input as an object with the following parameters:
- "filename": (string) [REQUIRED] The filename of the file to create.
- "content": (string) [OPTIONAL] The content of the file.`;

  schema = z.object({
    filename: z.string(),
    content: z.string().optional(),
  });

  async _call({ filename, content = '' }: z.infer<typeof this.schema>) {
    // Check if the directory exists and create it if it doesn't
    const directoryPath = path.dirname(`${filename}`);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Create the file with the specified content
    fs.writeFileSync(`${filename}`, content);
    return `Successfully created file ${filename} with the given content.`;
  }
}
