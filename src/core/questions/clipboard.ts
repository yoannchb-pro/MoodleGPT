import Config from "../../types/config";
import titleIndications from "../../utils/title-indications";

/**
 * Copy the response in the clipboard if we can automaticaly fill the question
 * @param config
 * @param inputList
 * @param response
 * @param force Force the copy to clipboard
 * @returns
 */
function handleClipboard(config: Config, response: string) {
  if (config.title) titleIndications("Copied to clipboard");
  navigator.clipboard.writeText(response);
}

export default handleClipboard;
