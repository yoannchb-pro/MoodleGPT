import type Config from '@typing/config';
import type GPTAnswer from '@typing/gpt-answer';

/**
 * Hanlde contenteditable elements
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleContentEditable(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const input = inputList[0];

  if (
    inputList.length !== 1 || // for now we don't handle many input for editable textcontent
    input.getAttribute('contenteditable') !== 'true'
  ) {
    return false;
  }

  if (config.typing) {
    let index = 0;

    const eventHandler = function (event: KeyboardEvent) {
      event.preventDefault();

      if (event.key === 'Backspace' || index > gptAnswer.response.length) {
        input.removeEventListener('keydown', eventHandler);
        return;
      }

      input.textContent = gptAnswer.response.slice(0, ++index);

      // Put the cursor at the end of the typed text
      input.focus();
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection !== null) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    input.addEventListener('keydown', eventHandler);
  } else {
    input.textContent = gptAnswer.response;
  }

  return true;
}

export default handleContentEditable;
