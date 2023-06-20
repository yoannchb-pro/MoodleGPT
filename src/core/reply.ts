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
import { removeListener } from "./code-listener";

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

  const gptAnswer = await getChatGPTResponse(config, question).catch(
    (error) => ({
      error,
    })
  );

  const haveError = typeof gptAnswer === "object" && "error" in gptAnswer;

  if (config.cursor)
    hiddenButton.style.cursor =
      config.infinite || haveError ? "pointer" : "initial";

  if (haveError) {
    console.error(gptAnswer.error);
    return;
  }

  if (config.logs) {
    Logs.question(question);
    Logs.response("Original: " + gptAnswer.response);
    Logs.response("Normalized: " + gptAnswer.normalizedResponse);
  }

  /* Handle clipboard mode */
  if (config.mode === "clipboard") {
    if (!config.infinite) removeListener(hiddenButton);
    return handleClipboard(config, gptAnswer);
  }

  /* Handle question to answer mode */
  if (config.mode === "question-to-answer") {
    removeListener(hiddenButton);

    const questionBackup = form.textContent;
    const questionContainer = form.querySelector<HTMLElement>(".qtext");

    questionContainer.textContent = gptAnswer.response;
    questionContainer.style.whiteSpace = "pre-wrap";

    questionContainer.addEventListener("click", function () {
      const isNotResponse = questionContainer.textContent === questionBackup;
      questionContainer.style.whiteSpace = isNotResponse ? "pre-wrap" : null;
      questionContainer.textContent = isNotResponse
        ? gptAnswer.response
        : questionBackup;
    });
    return;
  }

  /* Better then set once on the event because if there is an error the user can click an other time on the question */
  if (!config.infinite) removeListener(hiddenButton);

  const handlers = [
    handleContentEditable,
    handleTextbox,
    handleNumber,
    handleSelect,
    handleRadioAndCheckbox,
  ];

  for (const handler of handlers) {
    if (handler(config, inputList, gptAnswer)) return;
  }

  /* In the case we can't auto complete the question */
  handleClipboard(config, gptAnswer);
}

export default reply;
