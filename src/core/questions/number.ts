import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";

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

  if (inputList.length !== 1 || input.type !== "number") return false;

  const number = gptAnswer.normalizedResponse
    .match(/\d+([,\.]\d+)?/gi)?.[0]
    ?.replace(",", ".");

  if (!number) return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = number.length + 1;
      if (index > number.length) return;
      event.preventDefault();
      if (number.slice(index, index + 1) === ".") ++index;
      input.value = number.slice(0, ++index);
    });
  } else {
    input.value = number;
  }

  return true;
}

export default handleNumber;
