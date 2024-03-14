import GPTAnswer from '@typing/gpt-answer';
import { toPourcentage } from './pick-best-response';

class Logs {
  static question(text: string) {
    const css = 'color: cyan';
    console.log('%c[QUESTION]: %s', css, text);
  }

  static bestAnswer(answer: string, similarity: number) {
    const css = 'color: green';
    console.log(
      '%c[BEST ANSWER]: %s',
      css,
      `"${answer}" with a similarity of ${toPourcentage(similarity)}`
    );
  }

  static array(arr: unknown[]) {
    console.log('[CORRECTS] ', arr);
  }

  static response(gptAnswer: GPTAnswer) {
    console.log('Original:\n' + gptAnswer.response);
    console.log('Normalized:\n' + gptAnswer.normalizedResponse);
  }
}

export default Logs;
