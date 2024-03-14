import type Config from '@typing/config';
import { ROLE, CONTENT_TYPE, type MessageContent, type Message } from '@typing/message';
import imageToBase64 from '@utils/image-to-base64';
import isGPTModelGreaterOrEqualTo4 from '@utils/version-support-images';

// The attempt and the cmid allow us to identify a quiz
type History = {
  host: string;
  cmid: string; // The id of the quiz
  attempt: string; // The attempt of the current quiz
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
} as const satisfies Message;

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
    !config.includeImages ||
    !isGPTModelGreaterOrEqualTo4(config.model) ||
    imagesElements.length === 0
  ) {
    return question;
  }

  const contentWithImages: MessageContent = [];

  const base64Images = Array.from(imagesElements).map(imgEl => imageToBase64(imgEl));
  const base64ImagesResolved = await Promise.allSettled(base64Images);

  for (const result of base64ImagesResolved) {
    if (result.status === 'fulfilled') {
      contentWithImages.push({
        type: CONTENT_TYPE.IMAGE,
        image_url: { url: result.value }
      });
    } else if (config.logs) {
      console.error(result.reason);
    }
  }

  contentWithImages.push({
    type: CONTENT_TYPE.TEXT,
    text: question
  });

  return contentWithImages;
}

/**
 * Create a new history object from the current page
 * @returns
 */
function createNewHistory(): History {
  const urlParams = new URLSearchParams(document.location.search);

  return {
    host: document.location.host,
    cmid: urlParams.get('cmid') ?? '',
    attempt: urlParams.get('attempt') ?? '',
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
function areHistoryFromSameQuiz(a: History, b: History): boolean {
  const KEYS_TO_COMPARE: (keyof History)[] = ['host', 'cmid', 'attempt'];

  for (const key of KEYS_TO_COMPARE) {
    if (a[key] !== b[key]) return false;
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

  if (pastHistory === null || !areHistoryFromSameQuiz(pastHistory, newHistory)) {
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
