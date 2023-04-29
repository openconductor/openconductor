import dayjs from 'dayjs';
import { Tool } from 'langchain/tools';

export class OpenconductorDatetime extends Tool {
  name = 'openconductor-Datetime';
  description = `Useful for when you want to know the current date and time. Input is ignored.`;

  async _call() {
    return dayjs().format().toString();
  }
}
