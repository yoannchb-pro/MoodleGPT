import type Config from '../../types/config';
import type GPTAnswer from '../../types/gpt-answer';
import titleIndications from 'background/utils/title-indications';

/**
 * Copy the response in the clipboard if we can automaticaly fill the question
 * @param config
 * @param gptAnswer
 */
function handleClipboard(config: Config, gptAnswer: GPTAnswer) {
  if (config.title) titleIndications('Copied to clipboard');
  navigator.clipboard.writeText(gptAnswer.response);
}

export default handleClipboard;
