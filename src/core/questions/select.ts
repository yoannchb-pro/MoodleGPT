import Config from "../../types/config";
import Logs from "../../utils/logs";
import normalizeText from "../../utils/normalize-text";

/**
 * Handle select elements (and put in order select)
 * @param config
 * @param inputList
 * @param response
 * @returns
 */
function handleSelect(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  response: string
): boolean {
  if (inputList.length === 0 || inputList[0].tagName !== "SELECT") return false;

  let correct = response.split("\n");
  if (correct.length === 1 && correct.length !== inputList.length)
    correct = response.split(",");

  if (config.logs) Logs.array(correct);

  for (let j = 0; j < inputList.length; ++j) {
    const options = inputList[j].querySelectorAll("option");

    for (const option of options) {
      const content = normalizeText(option.textContent);
      const valide = correct[j].includes(content);

      /* Handle put in order question */
      if (!isNaN(parseInt(content))) {
        const content = normalizeText(
          (option.parentNode as HTMLElement)
            .closest("tr")
            .querySelector(".text").textContent
        );
        const index = correct.findIndex((c) => {
          const valide = c.includes(content);
          if (config.logs) Logs.responseTry(content, valide);
          return valide;
        });
        if (index !== -1) {
          if (config.mouseover) {
            options[index + 1].closest("select").addEventListener(
              "click",
              function () {
                options[index + 1].selected = "selected" as any;
              },
              { once: true }
            );
          } else {
            options[index + 1].selected = "selected" as any;
          }
          break;
        }
      }
      /* End */

      if (config.logs) Logs.responseTry(content, valide);

      if (valide) {
        if (config.mouseover) {
          option
            .closest("select")
            .addEventListener("click", () => (option.selected = true), {
              once: true,
            });
        } else {
          option.selected = true;
        }
        break;
      }
    }
  }

  return true;
}

export default handleSelect;
