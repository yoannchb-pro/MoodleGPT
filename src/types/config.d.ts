type Config = {
  apiKey: string;
  code: string;
  model?: string;
  infinite?: boolean;
  typing?: boolean;
  mouseover?: boolean;
  cursor?: boolean;
  logs?: boolean;
  title?: boolean;
  timeout?: boolean;
  mode?: "autocomplete" | "question-to-answer" | "clipboard";
};

export default Config;
