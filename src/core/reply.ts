import Config from "../types/config";
import Logs from "../utils/logs";
import getChatGPTResponse from "./get-response";
import createQuestion from "./create-question";
import handleRadioAndCheckbox from "./questions/radio-checkbox";
import handleSelect from "./questions/select";
import handleTextbox from "./questions/textbox";
import handleClipboard from "./questions/clipboard";
import handleNumber from "./questions/number";
import handleContentEditable from "./questions/contenteditable";
import { injectionFunction } from "./code-listener";

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

  const question = createQuestion(config, form);
  const inputList: NodeListOf<HTMLElement> = form.querySelectorAll(query);

  const response = await getChatGPTResponse(config, question).catch(
    (error) => ({
      error,
    })
  );

  const haveError = typeof response === "object" && "error" in response;

  if (config.cursor)
    hiddenButton.style.cursor =
      config.infinite || haveError ? "pointer" : "initial";

  if (haveError) {
    console.error(response.error);
    return;
  }

  if (config.logs) {
    Logs.question(question);
    Logs.response(response);
  }

  if (config.mode === "clipboard") {
    return handleClipboard(config, response);
  }

  if (config.mode === "question-to-answer") {
    const questionBackup = form.textContent;
    const questionContainer = form.querySelector(".qtext");
    questionContainer.textContent = response;
    questionContainer.addEventListener("click", function () {
      questionContainer.textContent =
        questionContainer.textContent === questionBackup
          ? response
          : questionBackup;
    });
    return;
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

  /* In the case we can't auto complete the question */
  handleClipboard(config, response);

  /* Better then set once on the event because if there is an error the user can click an other time on the question */
  if (!config.infinite)
    hiddenButton.removeEventListener("click", injectionFunction);
}

export default reply;
