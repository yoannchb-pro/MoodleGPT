import OpenAI from 'openai';
import { fixeO } from '../utils/fixe-o';
import type { GetChatCompletionRequest, GetChatCompletionResponse } from '../types/message';

export async function runChatCompletion(
  request: GetChatCompletionRequest['payload']
): Promise<GetChatCompletionResponse> {
  try {
    const isOllama = request.provider === 'ollama';
    const timeoutMs = isOllama ? 120 * 1000 : 20 * 1000;

    if (isOllama) {
      if (!request.baseURL) {
        return { ok: false, error: 'Missing Ollama base URL.' };
      }

      const url = new URL('chat/completions', request.baseURL.endsWith('/') ? request.baseURL : `${request.baseURL}/`).toString();
      console.debug('[MoodleGPT][Ollama] request', {
        url,
        model: request.model,
        maxTokens: request.maxTokens || 2000
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          max_tokens: request.maxTokens || 2000
        }),
        signal: request.timeout ? AbortSignal.timeout(timeoutMs) : undefined
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.warn('[MoodleGPT][Ollama] error response', {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return {
          ok: false,
          error: [response.status, response.statusText, errorText].filter(Boolean).join(' ')
        };
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      console.debug('[MoodleGPT][Ollama] success', { url, hasContent: !!data.choices?.[0]?.message?.content });

      return { ok: true, content: data.choices?.[0]?.message?.content ?? '' };
    }

    const client = new OpenAI({
      apiKey: request.apiKey,
      baseURL: request.baseURL,
      dangerouslyAllowBrowser: true
    });

    const body: any = {
      model: request.model,
      messages: request.messages,
      max_completion_tokens: request.maxTokens || 2000
    };

    const response = await client.chat.completions.create(fixeO(request.model, body), {
      signal: request.timeout ? AbortSignal.timeout(timeoutMs) : undefined
    });

    return { ok: true, content: response.choices[0].message.content ?? '' };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
