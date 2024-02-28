import type Config from "@typing/config";
import type GPTAnswer from "@typing/gptAnswer";
import Logs from "@utils/logs";
import normalizeText from "@utils/normalize-text";
import { pickBestReponse, toPourcentage } from "@utils/pick-best-response";

/**
 * Handle select elements (and put in order select)
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleSelect(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  gptAnswer: GPTAnswer
): boolean {
  if (inputList.length === 0 || inputList[0].tagName !== "SELECT") return false;

  const corrects = gptAnswer.normalizedResponse.split("\n");

  if (config.logs) Logs.array(corrects);

  for (let i = 0; i < inputList.length; ++i) {
    if (!corrects[i]) break;

    const options = inputList[i].querySelectorAll("option");

    const possibleAnswers = Array.from(options)
      .map((opt) => ({
        element: opt,
        value: normalizeText(opt.textContent ?? ""),
      }))
      .filter((obj) => obj.value !== "");

    const bestAnswer = pickBestReponse(corrects[i], possibleAnswers);

    if (config.logs && bestAnswer.value) {
      Logs.bestAnswer(bestAnswer.value, bestAnswer.similarity);
    }

    const correctOption = bestAnswer.element as HTMLOptionElement;
    const currentSelect = correctOption.closest("select");

    if (currentSelect === null) continue;

    if (config.mouseover) {
      currentSelect.addEventListener(
        "click",
        () => (correctOption.selected = true),
        {
          once: true,
        }
      );
    } else {
      correctOption.selected = true;
    }
  }

  return true;
}

export default handleSelect;
