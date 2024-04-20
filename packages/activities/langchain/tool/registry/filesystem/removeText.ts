import fs from 'fs';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemRemoveTextTool extends StructuredTool {
  name = 'filesystem-RemoveText';
  description = `Remove text from a file in the file system. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the file to remove text from, relative to your current directory.
- "position": (number) [REQUIRED] The position in the file to remove the text.
- "length": (number) [REQUIRED] The length of the text to remove from the file.`;

  schema = z.object({
    path: z.string(),
    position: z.number(),
    length: z.number(),
  });

  async _call({ path, position, length }: z.infer<typeof this.schema>) {
    const content = fs.readFileSync(path.trim(), 'utf8');
    const newContent = `${content.slice(0, position)}${content.slice(position + length)}`;
    fs.writeFileSync(path, newContent);
    return `Successfully removed text from ${path}.`;
  }
}
