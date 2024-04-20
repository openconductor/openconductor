import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';

export class Instructions {
  format(toolNames: string): {
    prefix: string;
    instructions: string;
    suffix: string;
  } {
    const prefix = `Your role is to orchestrate AI agents to achieve a task. Plan the following task as best you can. You have access to the following tools:`;
    const instructions = `Every tool has a cost, so be smart and efficient and aim to complete tasks with the least number of tools. Please format your results as an array of objects with the following parameters:
  - "name": (string) [REQUIRED] action to plan, should be one of [${toolNames}]
  - "input": (string) [REQUIRED] the input to the action.`;
    const suffix = `Begin!

Task: {input}`;

    return {
      prefix,
      instructions,
      suffix,
    };
  }
}

export const PLANNER_SYSTEM_PROMPT_MESSAGE_TEMPLATE = [
  `Let's first understand the problem and devise a plan to solve the problem.`,
  `Please output the plan starting with the header "Plan:"`,
  `and then followed by a numbered list of steps.`,
  `Please make the plan the minimum number of steps required`,
  `to answer the query or complete the task accurately and precisely.`,
  `Your steps should be general, and should not require a specific method to solve a step. If the task is a question,`,
  `the final step in the plan must be the following: "Given the above steps taken,`,
  `please respond to the original query."`,
  `At the end of your plan, say "<END_OF_PLAN>"`,
].join(' ');

export const PLANNER_CHAT_PROMPT = /* #__PURE__ */ ChatPromptTemplate.fromPromptMessages([
  /* #__PURE__ */ SystemMessagePromptTemplate.fromTemplate(PLANNER_SYSTEM_PROMPT_MESSAGE_TEMPLATE),
  /* #__PURE__ */ HumanMessagePromptTemplate.fromTemplate(`{input}`),
]);
