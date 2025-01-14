import type Config from '../../types/config';
import type GPTAnswer from '../../types/gpt-answer';
import Logs from 'background/utils/logs';
import normalizeText from 'background/utils/normalize-text';
import { pickBestReponse } from 'background/utils/pick-best-response';

/**
 * Handle input radio elements
 * @param config
 * @param inputList
 * @param gptAnswer
 */
function handleRadio(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const firstInput = inputList?.[0] as HTMLInputElement;

  // Handle the case the input is not a radio
  if (!firstInput || firstInput.type !== 'radio') {
    return false;
  }

  const possibleAnswers = Array.from(inputList)
    .map(inp => ({
      element: inp,
      value: normalizeText(inp?.parentElement?.textContent ?? '')
    }))
    .filter(obj => obj.value !== '');

  const bestAnswer = pickBestReponse(gptAnswer.normalizedResponse, possibleAnswers);

  if (config.logs && bestAnswer.value) {
    Logs.bestAnswer(bestAnswer.value, bestAnswer.similarity);
  }

  const correctInput = bestAnswer.element as HTMLInputElement;
  if (config.mouseover) {
    correctInput.addEventListener('mouseover', () => correctInput.click(), {
      once: true
    });
  } else {
    correctInput.click();
  }

  return true;
}

export default handleRadio;
