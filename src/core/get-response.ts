import type Config from '@typing/config';
import type GPTAnswer from '@typing/gptAnswer';
import normalizeText from '@utils/normalize-text';

type History = {
  url: string | null;
  system: { role: ROLE; content: string };
  history: { role: ROLE; content: string }[];
};

enum ROLE {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

const INSTRUCTION: string = `
Act as a quiz solver for the best notation with the following rules:
- When asked for the result of an equation, provide only the result without any other information and skip the other rules.
- If no answer(s) are given, answer the statement as usual without following the other rules, providing the most detailed, complete and precise explanation.
- For 'put in order' questions, provide the position of the answer separated by a new line (e.g., '1\n3\n2') and ignore other rules.- Always reply in this format: '<answer 1>\n<answer 2>\n...'
- Always reply in the format: '<answer 1>\n<answer 2>\n...'.
- Retain only the correct answer(s).
- Maintain the same order for the answers as in the text.
- Retain all text from the answer with its description, content or definition.
- Only provide answers that exactly match the given answer in the text.
- The question always has the correct answer(s), so you should always provide an answer.
- Always respond in the same language as the user's question.
`.trim();

const history: History = {
  url: null,
  system: {
    role: ROLE.SYSTEM,
    content: INSTRUCTION
  },
  history: []
};

/**
 * Get the response from chatGPT api
 * @param config
 * @param question
 * @returns
 */
async function getChatGPTResponse(config: Config, question: string): Promise<GPTAnswer> {
  const URL = location.hostname + location.pathname;

  // We reset the history when we enter a new moodle quiz or when it's desactivate
  if (!config.history || history.url !== URL) {
    history.url = URL;
    history.history = [];
  }

  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 15 * 1000);

  const message = { role: ROLE.USER, content: question };

  const req = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    signal: config.timeout ? controller.signal : null,
    body: JSON.stringify({
      model: config.model,
      messages: [history.system, ...history.history, message],
      temperature: 0.8,
      top_p: 1.0,
      presence_penalty: 1.0,
      stop: null
    })
  });

  clearTimeout(timeoutControler);

  const rep = await req.json();
  const response = rep.choices[0].message.content;

  // Register the conversation
  if (config.history) {
    history.history.push(message);
    history.history.push({ role: ROLE.ASSISTANT, content: response });
  }

  return {
    question,
    response,
    normalizedResponse: normalizeText(response)
  };
}

export default getChatGPTResponse;
