import Config from "../../types/config";
import GPTAnswer from "../../types/gptAnswer";
import titleIndications from "../../utils/title-indications";

/**
 * Copy the response in the clipboard if we can automaticaly fill the question
 * @param config
 * @param gptAnswer
 */
function handleClipboard(config: Config, gptAnswer: GPTAnswer) {
  if (config.title) titleIndications("Copied to clipboard");
  navigator.clipboard.writeText(gptAnswer.response);
}

export default handleClipboard;
