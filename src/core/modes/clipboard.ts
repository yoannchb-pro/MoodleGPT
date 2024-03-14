import type Config from '@typing/config';
import type GPTAnswer from '@typing/gpt-answer';
import handleClipboard from '@core/questions/clipboard';

type Props = {
  config: Config;
  questionElement: HTMLElement;
  gptAnswer: GPTAnswer;
  removeListener: () => void;
};

/**
 * Clipboard mode:
 * Simply copy the answer into the clipboard
 * @param props
 */
function clipboardMode(props: Props) {
  if (!props.config.infinite) props.removeListener();
  handleClipboard(props.config, props.gptAnswer);
}

export default clipboardMode;
