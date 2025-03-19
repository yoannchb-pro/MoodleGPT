import type Config from '../types/config';
import Logs from 'background/utils/logs';
import getChatGPTResponse from './get-response';
import createAndNormalizeQuestion from './create-question';
import clipboardMode from './modes/clipboard';
import questionToAnswerMode from './modes/question-to-answer';
import autoCompleteMode from './modes/autocomplete';

type Props = {
  config: Config;
  questionElement: HTMLElement;
  form: HTMLElement;
  inputQuery: string;
  removeListener: () => void;
};

/**
 * Reply to the question
 * @param props
 * @returns
 */
async function reply(props: Props): Promise<void> {
  if (props.config.cursor) props.questionElement.style.cursor = 'wait';

  const question = createAndNormalizeQuestion(props.form);
  const inputList: NodeListOf<HTMLElement> = props.form.querySelectorAll(props.inputQuery);

  const gptAnswer = await getChatGPTResponse(props.config, props.questionElement, question).catch(
    error => ({
      error
    })
  );

  const haveError = typeof gptAnswer === 'object' && 'error' in gptAnswer;

  if (props.config.cursor) {
    props.questionElement.style.cursor = props.config.infinite || haveError ? 'pointer' : 'initial';
  }

  if (haveError) {
    console.error(gptAnswer.error);
    return;
  }

  if (props.config.logs) {
    Logs.question(question);
    Logs.response(gptAnswer);
  }

  switch (props.config.mode) {
    case 'clipboard':
      clipboardMode({
        config: props.config,
        questionElement: props.questionElement,
        gptAnswer,
        removeListener: props.removeListener
      });
      break;
    case 'question-to-answer':
      questionToAnswerMode({
        gptAnswer,
        questionElement: props.questionElement,
        removeListener: props.removeListener
      });
      break;
    case 'autocomplete':
      autoCompleteMode({
        config: props.config,
        gptAnswer,
        inputList,
        questionElement: props.questionElement,
        removeListener: props.removeListener
      });
      break;
  }
}

export default reply;
