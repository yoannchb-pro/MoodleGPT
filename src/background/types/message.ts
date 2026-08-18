export enum ROLE {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum CONTENT_TYPE {
  TEXT = 'text',
  IMAGE = 'image_url'
}

export enum ACTION {
  GET_CHAT_COMPLETION = 'GET_CHAT_COMPLETION'
}

export type MessageContent =
  | string
  | Array<
      | {
          type: CONTENT_TYPE.TEXT;
          text: string;
        }
      | {
          type: CONTENT_TYPE.IMAGE;
          image_url: { url: string };
        }
    >;

export type Message = {
  role: ROLE;
  content: MessageContent;
};

export type GetChatCompletionRequest = {
  action: ACTION.GET_CHAT_COMPLETION;
  payload: {
    provider?: 'openai' | 'ollama';
    apiKey: string;
    baseURL?: string;
    model: string;
    maxTokens?: number;
    timeout?: boolean;
    messages: Message[];
  };
};

export type GetChatCompletionResponse =
  | {
      ok: true;
      content: string;
    }
  | {
      ok: false;
      error: string;
    };
