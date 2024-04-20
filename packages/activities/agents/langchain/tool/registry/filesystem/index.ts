import fs from 'fs';
import path from 'path';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class FilesystemCreateFileTool extends StructuredTool {
  name = 'filesystem-CreateFile';
  description = `Create a file with the specified content. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the file to create, relative to your current directory.
- "text": (string) [REQUIRED] The content of the file.`;

  schema = z.object({
    path: z.string(),
    text: z.string(),
  });

  async _call({ path: filePath, text }: z.infer<typeof this.schema>) {
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

export class FilesystemInsertTextTool extends StructuredTool {
  name = 'filesystem-InsertText';
  description = `Insert text to a file in the file system. Please format your input as an object with the following parameters:
- "path": (string) [REQUIRED] The path to the file to insert text into, relative to your current directory.
- "text": (string) [REQUIRED] The text to insert into the file.
- "position": (number) [OPTIONAL] The position in the file to insert the text. If not provided, the text will be inserted at the end of the file.`;

  schema = z.object({
    path: z.string(),
    text: z.string(),
    position: z.number().optional(),
  });

  async _call({ path, text, position = text.length }: z.infer<typeof this.schema>) {
    const content = fs.readFileSync(path.trim(), 'utf8');
    const newContent = `${content.slice(0, position)}${text}${content.slice(position)}`;
    fs.writeFileSync(path, newContent);
    return `Successfully inserted text into ${path}.`;
  }
}

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

export class ProcessChangeDirectoryTool extends StructuredTool {
  name = 'process-ChangeDirectory';
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
