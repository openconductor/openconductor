import { BaseOutputParser } from 'langchain/dist/schema/output_parser';

export function preprocessJsonInput(inputStr: string): string {
  // Replace single backslashes with double backslashes,
  // while leaving already escaped ones intact
  const correctedStr = inputStr.replace(/(?<!\\)\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
  return correctedStr;
}

export interface ConductorOutput {
  name: string;
  input: string;
}

export class ConductorOutputParser extends BaseOutputParser<ConductorOutput[]> {
  getFormatInstructions(): string {
    throw new Error('Method not implemented.');
  }

  async parse(text: string): Promise<ConductorOutput[]> {
    let parsed: [
      {
        name: string;
        input: string;
      },
    ];
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      const preprocessedText = preprocessJsonInput(text);
      try {
        parsed = JSON.parse(preprocessedText);
      } catch (error) {
        return [
          {
            name: 'ERROR',
            input: `Could not parse invalid json: ${text}`,
          },
        ];
      }
    }
    try {
      return parsed;
    } catch (error) {
      return [
        {
          name: 'ERROR',
          input: `Incomplete: ${parsed}`,
        },
      ];
    }
  }
}
