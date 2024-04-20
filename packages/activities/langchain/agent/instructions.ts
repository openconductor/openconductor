export class Instructions {
  format(toolNames: string): {
    prefix: string;
    instructions: string;
    suffix: string;
  } {
    const prefix = `Execute the following task as best you can. You have access to the following tools:`;
    const instructions = `Use the following format:

Task: the input task you must finish
Thought: you should always think about what to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I have finished the task
End: the result of the original input task`;
    const suffix = `Begin!

Task: {input}
Thought:{agent_scratchpad}`;

    return {
      prefix,
      instructions,
      suffix,
    };
  }
}
