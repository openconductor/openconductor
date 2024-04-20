import { Tool } from 'langchain/tools';
import fs from 'fs';

export class FsReadFile extends Tool {
  name = 'Fs Read File';
  description = `Read a file from the filesystem. Please format your input as a path relative to your current directory.`;
  async _call(input: string) {
    return fs.readFileSync(input.trim(), 'utf8');
  }
}

export class FsListFiles extends Tool {
  name = 'Fs List Files';
  description = `List the files in a directory. Please format your input as a path relative to your current directory.`;
  async _call(input: string) {
    return `The files in the ${input} directory include: ${fs.readdirSync(input.trim(), 'utf8').join(', ')}`;
  }
}

export class FsInsertText extends Tool {
  name = 'Fs Insert Text';
  description = `Insert text to a file in the file system. Please format your input as a json object with the following parameters:
- path: (string) [REQUIRED] The path to the file to insert text into, relative to your current directory.
- text: (string) [REQUIRED] The text to insert into the file.
- position: (number) [OPTIONAL] The position in the file to insert the text. If not provided, the text will be inserted at the end of the file.`;
  async _call(input: string) {
    const { path, text, position = text.length } = JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, ''));
    const content = fs.readFileSync(path.trim(), 'utf8');
    const newContent = `${content.slice(0, position)}${text}${content.slice(position)}`;
    fs.writeFileSync(path, newContent);
    return `Successfully inserted text into ${path}.`;
  }
}

export class FsRemoveText extends Tool {
  name = 'Fs Remove Text';
  description = `Remove text from a file in the file system. Please format your input as a json object with the following parameters:
- path: (string) [REQUIRED] The path to the file to insert text into, relative to your current directory.
- position: (number) [REQUIRED] The position in the file to insert the text. If not provided, the text will be inserted at the end of the file.
- length: (number) [REQUIRED] The length of the text to remove from the file.`;
  async _call(input: string) {
    const { path, length, position } = JSON.parse(input.trim().replace(/^```/, '').replace(/```$/, ''));
    const content = fs.readFileSync(input.trim(), 'utf8');
    const newContent = `${content.slice(0, position)}${content.slice(position + length)}`;
    fs.writeFileSync(path, newContent);
    return `Successfully inserted text into ${path}.`;
  }
}
