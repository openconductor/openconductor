import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemInsertContentTool extends StructuredTool {
  name = 'filesystem-InsertContent';
  description = `Write or insert content to a file in the file system. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the file to insert content into, relative to your current directory.
- "content": (string) [REQUIRED] The content to insert into the file.
- "position": (number) [OPTIONAL] The position in the file to insert the content. If not provided, the content will be inserted at the end of the file.`;

  schema = z.object({
    path: z.string(),
    text: z.string(),
    position: z.number().optional(),
  });

  async _call({ path, text, position = text.length }: z.infer<typeof this.schema>) {
    const content = fs.readFileSync(path.trim(), 'utf8');
    const newContent = `${content.slice(0, position)}${content}${content.slice(position)}`;
    fs.writeFileSync(path, newContent);
    return `Successfully inserted content into ${path}.`;
  }
}
