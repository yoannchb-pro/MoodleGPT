import type Config from '../../types/config';
import type GPTAnswer from '../../types/gpt-answer';

/**
 * Hanlde atto editor
 * See: https://docs.moodle.org/404/en/Atto_editor#Atto_accessibility
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleAtto(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const input = inputList[0];

  if (!input.classList.contains('qtype_essay_editor')) {
    return false;
  }

  const iframe = input.querySelector('iframe');
  if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body || !iframe.contentWindow) {
    return false;
  }
  const iframeBody = iframe.contentDocument.body;

  const textContainer = iframeBody.querySelector('p');
  if (!textContainer) return false;

  if (config.typing) {
    let index = 0;
    const eventHandler = function (event: KeyboardEvent) {
      event.preventDefault();

      if (event.key === 'Backspace' || index >= gptAnswer.response.length) {
        iframe.contentWindow!.removeEventListener('keydown', eventHandler);
        return;
      }

      // Append text one character at a time
      const textNode = document.createTextNode(gptAnswer.response.charAt(index++));
      textContainer.appendChild(textNode);

      // Move the cursor after the last character
      const range = iframe.contentDocument!.createRange();
      range.selectNodeContents(textContainer);
      range.collapse(false); // Collapse the range to the end point
      const selection = iframe.contentWindow!.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      iframe.contentWindow!.focus(); // Focus the iframe window to see cursor
    };

    iframe.contentWindow.addEventListener('keydown', eventHandler);
  } else {
    textContainer.textContent += gptAnswer.response;
  }

  return true;
}

export default handleAtto;
