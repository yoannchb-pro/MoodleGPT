type Config = {
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
  mode?: 'autocomplete' | 'question-to-answer' | 'clipboard';
};

export default Config;
