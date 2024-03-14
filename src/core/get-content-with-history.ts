import type Config from '@typing/config';
import { ROLE, CONTENT_TYPE, type MessageContent, type Message } from '@typing/message';
import imageToBase64 from '@utils/image-to-base64';
import isGPTModelGreaterOrEqualTo4 from '@utils/version-support-images';

// @TODO: implement cmid, attempt, effacer choix

type History = {
  url: string | null;
  params: Record<string, string>;
  history: { role: ROLE; content: MessageContent }[];
};

const INSTRUCTION: string = `
Act as a quiz solver for the best notation with the following rules:
- If no answer(s) are given, answer the statement as usual without following the other rules, providing the most detailed, complete and precise explanation. 
  But for the calculation provide this format 'result: <result of the equation>\nexplanation: <explanation>'
- For 'put in order' questions, provide the position of the answer separated by a new line (e.g., '1\n3\n2') and ignore other rules.- Always reply in this format: '<answer 1>\n<answer 2>\n...'
- Always reply in the format: '<answer 1>\n<answer 2>\n...'.
- Retain only the correct answer(s).
- Maintain the same order for the answers as in the text.
- Retain all text from the answer with its description, content or definition.
- Only provide answers that exactly match the given answer in the text.
- The question always has the correct answer(s), so you should always provide an answer.
- Always respond in the same language as the user's question.
`.trim();

const SYSTEM_INSTRUCTION_MESSAGE = {
  role: ROLE.SYSTEM,
  content: INSTRUCTION
} as const;

/**
 * Get the content to send to ChatGPT API (it allows to includes images if supported)
 * @param config
 */
async function getContent(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<MessageContent> {
  const imagesElements = questionElement.querySelectorAll('img');

  if (
    config.includeImages &&
    isGPTModelGreaterOrEqualTo4(config.model) &&
    imagesElements.length === 0
  ) {
    return question;
  }

  let content: MessageContent = [];

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
 * Create a new history object from the current page
 * @returns
 */
function createNewHistory(): History {
  const url_params = new URLSearchParams(document.location.search).entries();
  const params: Record<string, string> = {};

  for (const [key, value] of url_params) {
    if (key === 'page') continue;
    params[key] = value;
  }

  return {
    url: document.location.host,
    params,
    history: []
  };
}

/**
 * Load the past history from the session storage otherwise return the default history object
 * @returns
 */
function loadPastHistory(): History | null {
  return JSON.parse(sessionStorage.moodleGPTHistory ?? 'null');
}

/**
 * Check if two history are from the same origin
 * @param a
 * @param b
 * @returns
 */
function areHistorySameOrigin(a: History, b: History): boolean {
  if (a.url !== b.url) return false;

  if (Object.keys(a.params).length !== Object.keys(b.params).length) return false;

  for (const [key, value] of Object.entries(a.params)) {
    if (!(key in b.params) || b.params[key] !== value) return false;
  }

  return true;
}

/**
 * Return the content to send to chatgpt api with history if needed
 * @param config
 * @param questionElement
 * @param question
 * @returns
 */
async function getContentWithHistory(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<{
  messages: [typeof SYSTEM_INSTRUCTION_MESSAGE, ...Message[]];
  saveResponse?: (response: string) => void;
}> {
  const content = await getContent(config, questionElement, question);
  const message = { role: ROLE.USER, content };

  if (!config.history) return { messages: [SYSTEM_INSTRUCTION_MESSAGE, message] };

  let history: History;

  const pastHistory: History | null = loadPastHistory();
  const newHistory: History = createNewHistory();

  if (pastHistory === null || !areHistorySameOrigin(pastHistory, newHistory)) {
    history = newHistory;
  } else {
    history = pastHistory;
  }

  return {
    messages: [SYSTEM_INSTRUCTION_MESSAGE, ...history.history, message],
    saveResponse(response: string) {
      // Register the conversation
      if (config.history) {
        history.history.push(message);
        history.history.push({ role: ROLE.ASSISTANT, content: response });
        sessionStorage.moodleGPTHistory = JSON.stringify(history);
      }
    }
  };
}

export default getContentWithHistory;
