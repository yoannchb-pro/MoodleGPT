import type Config from '@typing/config';
import type GPTAnswer from '@typing/gptAnswer';

/**
 * Handle number input
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleNumber(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const input = inputList[0] as HTMLInputElement | HTMLTextAreaElement;

  if (
    inputList.length !== 1 || // for now we don't handle many input number
    input.type !== 'number'
  ) {
    return false;
  }

  const number = gptAnswer.normalizedResponse.match(/\d+([,.]\d+)?/gi)?.[0]?.replace(',', '.');

  if (number === undefined) return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener('keydown', function (event: Event) {
      event.preventDefault();
      if ((<KeyboardEvent>event).key === 'Backspace') index = number.length + 1;
      if (index > number.length) return;
      if (number.slice(index, index + 1) === '.') ++index;
      input.value = number.slice(0, ++index);
    });
  } else {
    input.value = number;
  }

  return true;
}

export default handleNumber;
