import type Config from '../types/config';
import type GPTAnswer from '../types/gpt-answer';
import normalizeText from 'background/utils/normalize-text';
import getContentWithHistory from './get-content-with-history';
import OpenAI from 'openai';
import { fixeO1 } from '../utils/fixe-o1';

/**
 * Get the response from chatGPT api
 * @param config
 * @param question
 * @returns
 */
async function getChatGPTResponse(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<GPTAnswer> {
  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 20 * 1000);

  // Get the content to send to chatgpt
  // Including the instructions to the AI, the images as base64 if needed, the question and the past conversation if history is set to true
  const contentHandler = await getContentWithHistory(config, questionElement, question);

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    dangerouslyAllowBrowser: true
  });

  const req = await client.chat.completions.create(
    fixeO1(config.model, {
      model: config.model,
      messages: contentHandler.messages,

      temperature: 0.1, // Controls the randomness of the generated responses, with lower values producing more deterministic and predictable outputs. With set to 0.1 instead of 0 for more creativity.
      top_p: 0.6, // Determines the diversity of the generated responses
      presence_penalty: 0, // Encourages the model to introduce new concepts by penalizing words that have already appeared in the text.
      max_tokens: config.maxTokens || 2000 // Maximum length of the response,
    }),
    { signal: config.timeout ? controller.signal : null }
  );

  clearTimeout(timeoutControler);

  const response = req.choices[0].message.content ?? '';

  // Save the response into the history
  if (typeof contentHandler.saveResponse === 'function') contentHandler.saveResponse(response);

  return {
    question,
    response,
    normalizedResponse: normalizeText(response)
  };
}

export default getChatGPTResponse;
