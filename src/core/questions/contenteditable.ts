import type Config from "@typing/config";
import type GPTAnswer from "@typing/gptAnswer";

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
    inputList.length !== 1 ||
    input.getAttribute("contenteditable") !== "true"
  )
    return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = gptAnswer.response.length + 1;
      if (index > gptAnswer.response.length) return;
      event.preventDefault();
      input.textContent = gptAnswer.response.slice(0, ++index);

      /* Put the cursor at the end of the typed text */
      input.focus();
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  } else {
    input.textContent = gptAnswer.response;
  }

  return true;
}

export default handleContentEditable;
