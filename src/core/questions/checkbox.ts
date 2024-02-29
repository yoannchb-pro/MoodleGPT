import type Config from '@typing/config';
import type GPTAnswer from '@typing/gptAnswer';
import Logs from '@utils/logs';
import normalizeText from '@utils/normalize-text';
import { pickBestReponse } from '@utils/pick-best-response';

/**
 * Handle input checkbox elements
 * @param config
 * @param inputList
 * @param gptAnswer
 */
function handleCheckbox(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const firstInput = inputList?.[0] as HTMLInputElement;

  // Handle the case the input is not a checkbox
  if (!firstInput || firstInput.type !== 'checkbox') {
    return false;
  }

  const corrects = gptAnswer.normalizedResponse.split('\n');

  const possibleAnswers = Array.from(inputList)
    .map(inp => ({
      element: inp,
      value: normalizeText(inp?.parentElement?.textContent ?? '')
    }))
    .filter(obj => obj.value !== '');

  for (const correct of corrects) {
    const bestAnswer = pickBestReponse(correct, possibleAnswers);

    if (config.logs && bestAnswer.value) {
      Logs.bestAnswer(bestAnswer.value, bestAnswer.similarity);
    }

    const correctInput = bestAnswer.element as HTMLInputElement;
    if (config.mouseover) {
      correctInput.addEventListener('mouseover', () => (correctInput.checked = true), {
        once: true
      });
    } else {
      correctInput.checked = true;
    }
  }

  return true;
}

export default handleCheckbox;
