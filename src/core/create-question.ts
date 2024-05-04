import normalizeText from '@utils/normalize-text';
import htmlTableToString from '@utils/html-table-to-string';
import getVisibleText from '@utils/get-visible-text';

/**
 * Normalize the question as text and add sub informations
 * @param langage
 * @param question
 * @returns
 */
function createAndNormalizeQuestion(questionContainer: HTMLElement) {
  let question = getVisibleText(questionContainer);

  // Make tables more readable for chat-gpt
  const tables: NodeListOf<HTMLTableElement> = questionContainer.querySelectorAll('.qtext table');
  for (const table of tables) {
    question = question.replace(table.innerText, '\n' + htmlTableToString(table) + '\n');
  }

  return normalizeText(question, false);
}

export default createAndNormalizeQuestion;
