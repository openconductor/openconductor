import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

// https://openai.com/pricing as of 07/11/23

interface ModelPrices {
  inputPrice: number;
  outputPrice: number;
}

type OpenAiModelName = ChatCompletionCreateParamsBase['model'] | 'gpt-4-1106-preview';

// @ts-ignore
const modelPrices: Record<OpenAiModelName, ModelPrices> = {
  'text-embedding-ada-002': {
    inputPrice: 0.0000001,
    outputPrice: 0.0000001,
  },
  'gpt-3.5-turbo-1106': {
    inputPrice: 0.000001,
    outputPrice: 0.000002,
  },
  // "gpt-4-0613": {
  //   inputPrice: 0.00003,
  //   outputPrice: 0.00006,
  // },
  // "gpt-4-32k-0613": {
  //   inputPrice: 0.00006,
  //   outputPrice: 0.00012,
  // },
  'gpt-4-1106-preview': {
    inputPrice: 0.00001,
    outputPrice: 0.00003,
  },
  'gpt-4-0125-preview': {
    inputPrice: 0.00001,
    outputPrice: 0.00003,
  },
};

export const openaiCost = ({
  model,
  tokensCountInput,
  tokensCountOutput,
}: {
  model: OpenAiModelName;
  tokensCountInput: number;
  tokensCountOutput: number;
}): number => {
  let cost = 0;
  if (model && modelPrices[model]) {
    const { inputPrice, outputPrice } = modelPrices[model] as ModelPrices;
    cost = Math.round((tokensCountInput * inputPrice + tokensCountOutput * outputPrice) * 1e4) / 1e4;
  }

  return cost;
};
