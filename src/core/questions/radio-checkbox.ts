import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";
import Logs from "../../utils/logs";
import normalizeText from "../../utils/normalize-text";

/**
 * Handle checkbox and input elements
 * @param config
 * @param inputList
 * @param gptAnswer
 */
function handleRadioAndCheckbox(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  const input = inputList?.[0] as HTMLInputElement;

  if (!input || (input.type !== "checkbox" && input.type !== "radio"))
    return false;

  for (const input of inputList as NodeListOf<HTMLInputElement>) {
    const content = normalizeText(input.parentNode.textContent);
    const valide =
      gptAnswer.normalizedResponse.includes(content) ||
      content.includes(gptAnswer.normalizedResponse);
    if (config.logs) Logs.responseTry(content, valide);
    if (valide) {
      if (config.mouseover) {
        input.addEventListener("mouseover", () => (input.checked = true), {
          once: true,
        });
      } else {
        input.checked = true;
      }
    }
  }
  return true;
}

export default handleRadioAndCheckbox;
