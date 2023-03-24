import Config from "../types/config";
import Logs from "../utils/logs";
import getChatGPTResponse from "./get-response";
import normalizeQuestion from "./normalize-question";
import handleRadioAndCheckbox from "./questions/radio-checkbox";
import handleSelect from "./questions/select";
import handleTextbox from "./questions/textbox";
import handleClipboard from "./questions/clipboard";
import handleNumber from "./questions/number";
import handleContentEditable from "./questions/contenteditable";

/**
 * Reply to the question
 * @param config
 * @param hiddenButton
 * @param form
 * @param query
 * @returns
 */
async function reply(
  config: Config,
  hiddenButton: HTMLElement,
  form: HTMLElement,
  query: string
) {
  if (config.cursor) hiddenButton.style.cursor = "wait";

  form.querySelector(".accesshide")?.remove();

  const question = normalizeQuestion(config, form);
  const inputList: NodeListOf<HTMLElement> = form.querySelectorAll(query);

  const response = await getChatGPTResponse(config, question).catch(
    (error) => ({
      error,
    })
  );

  if (config.cursor)
    hiddenButton.style.cursor = config.infinite ? "pointer" : "initial";

  if (typeof response === "object" && "error" in response) {
    console.error(response.error);
    return;
  }

  if (config.logs) {
    Logs.question(question);
    Logs.response(response);
  }

  const handlers = [
    handleContentEditable,
    handleTextbox,
    handleNumber,
    handleSelect,
    handleRadioAndCheckbox,
  ];

  for (const handler of handlers) {
    if (handler(config, inputList, response)) return;
  }

  handleClipboard(config, response);
}

export default reply;
