import type Config from '@typing/config';
import type GPTAnswer from '@typing/gpt-answer';

/**
 * Handle textbox
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleTextbox(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const input = inputList[0] as HTMLInputElement | HTMLTextAreaElement;

  if (
    inputList.length !== 1 || // for now we don't handle many input text
    (input.tagName !== 'TEXTAREA' && input.type !== 'text')
  ) {
    return false;
  }

  if (config.typing) {
    let index = 0;

    const eventHandler = function (event: Event) {
      event.preventDefault();

      if ((<KeyboardEvent>event).key === 'Backspace' || index >= gptAnswer.response.length) {
        input.removeEventListener('keydown', eventHandler);
        return;
      }

      input.value = gptAnswer.response.slice(0, ++index);
    };

    input.addEventListener('keydown', eventHandler);
  } else {
    input.value = gptAnswer.response;
  }

  return true;
}

export default handleTextbox;
