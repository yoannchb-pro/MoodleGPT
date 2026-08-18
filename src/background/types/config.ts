type Config = {
  provider?: 'openai' | 'ollama';
  apiKey: string;
  model: string;
  code?: string;
  infinite?: boolean;
  typing?: boolean;
  mouseover?: boolean;
  cursor?: boolean;
  logs?: boolean;
  title?: boolean;
  timeout?: boolean;
  history?: boolean;
  includeImages?: boolean;
  webSearch?: boolean;
  ragDocuments?: boolean;
  mode?: 'autocomplete' | 'question-to-answer' | 'clipboard';
  baseURL?: string;
  maxTokens?: number;
  ollamaTimeout?: number;
};

export default Config;
