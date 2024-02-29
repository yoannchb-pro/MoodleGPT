import type Config from '@typing/config';
import type GPTAnswer from '@typing/gptAnswer';
import imageToBase64 from '@utils/image-to-base64';
import normalizeText from '@utils/normalize-text';
import isGPTModelGreaterOrEqualTo4 from '@utils/version-support-images';

type Content =
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

type History = {
  url: string | null;
  system: { role: ROLE; content: Content };
  history: { role: ROLE; content: Content }[];
};

enum ROLE {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

enum CONTENT_TYPE {
  TEXT = 'text',
  IMAGE = 'image_url'
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
 * Get the content to send to ChatGPT API (it allows to includes images if supported)
 * @param config
 */
async function getContent(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<Content> {
  const imagesElements = questionElement.querySelectorAll('img');

  if (
    config.includeImages &&
    isGPTModelGreaterOrEqualTo4(config.model) &&
    imagesElements.length === 0
  ) {
    return question;
  }

  let content: Content = [];

  const base64Images = Array.from(imagesElements).map(imgEl => imageToBase64(imgEl));
  const results = await Promise.all(base64Images);
  const filteredResults = results.filter(value => value !== null) as string[];

  for (const result of filteredResults) {
    content.push({
      type: CONTENT_TYPE.IMAGE,
      image_url: { url: result }
    });
  }

  if (content.length > 0) {
    content.push({
      type: CONTENT_TYPE.TEXT,
      text: question
    });
  } else {
    content = question;
  }

  return content;
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
  const URL = location.hostname + location.pathname;

  // We reset the history when we enter a new moodle quiz or when it's desactivate
  if (!config.history || history.url !== URL) {
    history.url = URL;
    history.history = [];
  }

  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 15 * 1000);

  const content = await getContent(config, questionElement, question);
  const message = { role: ROLE.USER, content };

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
      ...(isGPTModelGreaterOrEqualTo4(config.model) ? { max_tokens: 1000 } : { stop: null }) // look like that on 3.5 we can say stop do null but not on gpt >= 4
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
