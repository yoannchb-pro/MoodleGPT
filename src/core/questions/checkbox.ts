import type Config from '@typing/config';
import type GPTAnswer from '@typing/gpt-answer';
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
      element: inp as HTMLInputElement,
      value: normalizeText(inp?.parentElement?.textContent ?? '')
    }))
    .filter(obj => obj.value !== '');

  // Find the best answers elements
  const correctElements: Set<HTMLInputElement> = new Set();
  for (const correct of corrects) {
    const bestAnswer = pickBestReponse(correct, possibleAnswers);

    if (config.logs && bestAnswer.value) {
      Logs.bestAnswer(bestAnswer.value, bestAnswer.similarity);
    }

    correctElements.add(bestAnswer.element as HTMLInputElement);
  }

  // Check if it should be checked or not
  for (const element of possibleAnswers.map(e => e.element)) {
    const needAction =
      (element.checked && !correctElements.has(element)) ||
      (!element.checked && correctElements.has(element));

    const action = () => needAction && element.click();

    if (config.mouseover) {
      element.addEventListener('mouseover', action, {
        once: true
      });
    } else {
      action();
    }
  }

  return true;
}

export default handleCheckbox;
