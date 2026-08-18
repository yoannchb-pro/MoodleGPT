import type Config from '../types/config';
import type GPTAnswer from '../types/gpt-answer';
import normalizeText from 'background/utils/normalize-text';
import getContentWithHistory from './get-content-with-history';
import OpenAI from 'openai';
import { fixeO } from '../utils/fixe-o';

type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

async function fetchWebSearchResults(query: string, proxyBaseURL: string): Promise<WebSearchResult[]> {
  const base = new URL(proxyBaseURL.endsWith('/') ? proxyBaseURL : `${proxyBaseURL}/`);
  const url = new URL('/search', `${base.origin}/`);
  url.searchParams.set('q', query);

  const response = await fetch(url.toString());
  const data = (await response.json().catch(() => ({}))) as {
    results?: WebSearchResult[];
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || `${response.status} ${response.statusText}`);
  }

  return Array.isArray(data.results) ? data.results : [];
}

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
  const isOllama = config.provider === 'ollama';
  const timeoutMs = 20 * 1000;
  let timeoutControler: ReturnType<typeof setTimeout> | undefined;

  // Get the content to send to chatgpt
  // Including the instructions to the AI, the images as base64 if needed, the question and the past conversation if history is set to true
  const contentHandler = await getContentWithHistory(config, questionElement, question);

  let responseText = '';

  if (isOllama) {
    const ollamaTimeoutSec = config.ollamaTimeout ?? 0;
    const proxyBaseURL = config.baseURL;
    if (!proxyBaseURL) {
      throw new Error('Missing Ollama base URL.');
    }

    let escHoldTimer: ReturnType<typeof setTimeout> | undefined;
    let ollamaTimeoutControler: ReturnType<typeof setTimeout> | undefined;
    let escHoldStart = 0;

    const cleanupEscListener = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      if (escHoldTimer) clearTimeout(escHoldTimer);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && escHoldTimer) {
        clearTimeout(escHoldTimer);
        escHoldTimer = undefined;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.repeat || escHoldTimer) return;

      escHoldStart = Date.now();
      escHoldTimer = setTimeout(() => {
        if (Date.now() - escHoldStart >= 2000) controller.abort();
      }, 2000);
    };

    if (ollamaTimeoutSec === 0) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
    } else {
      ollamaTimeoutControler = setTimeout(() => controller.abort(), ollamaTimeoutSec * 1000);
    }

    try {
      const searchContext = config.webSearch
        ? await fetchWebSearchResults(question, proxyBaseURL).then(results => {
            if (!results.length) return '';
            return [
              'Web search results:',
              ...results.map(
                (result, index) =>
                  `${index + 1}. ${result.title}\n${result.url}\n${result.snippet}`
              )
            ].join('\n\n');
          })
        : '';

      const messages = searchContext
        ? [
            ...contentHandler.messages.slice(0, 1),
            {
              role: 'system' as const,
              content:
                'Use the web search results below as supporting context. Prefer them when they help answer the question.'
            },
            ...contentHandler.messages.slice(1, contentHandler.messages.length - 1),
            {
              role: 'system' as const,
              content: searchContext
            },
            contentHandler.messages[contentHandler.messages.length - 1]
          ]
        : contentHandler.messages;

      const url = new URL(
        'chat/completions',
        proxyBaseURL.endsWith('/') ? proxyBaseURL : `${proxyBaseURL}/`
      ).toString();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          max_tokens: config.maxTokens || 2000
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error([response.status, response.statusText, errorText].filter(Boolean).join(' '));
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      responseText = data.choices?.[0]?.message?.content ?? '';
    } finally {
      if (ollamaTimeoutControler) clearTimeout(ollamaTimeoutControler);
      cleanupEscListener();
    }
  } else {
    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: true
    });

    if (config.timeout) {
      timeoutControler = setTimeout(() => controller.abort(), timeoutMs);
    }

    const requestBody: any = {
      model: config.model,
      messages: contentHandler.messages,
      max_completion_tokens: config.maxTokens || 2000
    };

    const req = await client.chat.completions.create(fixeO(config.model, requestBody), {
      signal: config.timeout ? controller.signal : null
    });

    responseText = req.choices[0].message.content ?? '';
  }

  if (timeoutControler) clearTimeout(timeoutControler);

  // Save the response into the history
  if (typeof contentHandler.saveResponse === 'function') contentHandler.saveResponse(responseText);

  return {
    question,
    response: responseText,
    normalizedResponse: normalizeText(responseText)
  };
}

export default getChatGPTResponse;
