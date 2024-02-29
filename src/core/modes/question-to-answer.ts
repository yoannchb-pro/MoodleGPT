import type GPTAnswer from '@typing/gptAnswer';

type Props = {
  questionElement: HTMLElement;
  gptAnswer: GPTAnswer;
  removeListener: () => void;
};

/**
 * Question to answer mode:
 * Simply turn the question into the answer by clicking on it
 * @param props
 */
function questionToAnswerMode(props: Props) {
  const questionElement = props.questionElement;

  props.removeListener();

  const questionBackup = questionElement.textContent;

  questionElement.textContent = props.gptAnswer.response;

  // Format the content
  questionElement.style.whiteSpace = 'pre-wrap';

  // To go back to the question / answer
  let contentIsResponse = true;
  questionElement.addEventListener('click', function () {
    questionElement.style.whiteSpace = contentIsResponse ? '' : 'pre-warp';
    questionElement.textContent = contentIsResponse ? questionBackup : props.gptAnswer.response;

    contentIsResponse = !contentIsResponse;
  });
}

export default questionToAnswerMode;
