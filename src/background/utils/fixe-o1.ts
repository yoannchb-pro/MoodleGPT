import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions';

/**
 * Fixe request body for "o1" model
 * @param model
 * @param data
 * @returns
 */
export function fixeO1(model: string, data: ChatCompletionCreateParamsNonStreaming) {
  if (!model.startsWith('o1')) return data;

  if (data.max_tokens) {
    data.max_completion_tokens = data.max_tokens;
    delete data.max_tokens;
  }

  if (data.temperature) delete data.temperature;

  if (data.top_p) delete data.top_p;

  for (const message of data.messages) {
    if (message.role === 'system') message.role = 'user' as any;
  }

  return data;
}
