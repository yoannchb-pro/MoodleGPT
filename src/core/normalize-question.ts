import Config from "../types/config";
import normalizeText from "../utils/normalize-text";
import htmlTableToString from "../utils/html-table-to-string";

/**
 * Normalize the question and add sub informations
 * @param langage
 * @param question
 * @returns
 */
function normalizeQuestion(config: Config, questionContainer: HTMLElement) {
  let question = questionContainer.textContent;

  if (config.table) {
    //make table more readable for chat-gpt
    const tables: NodeListOf<HTMLTableElement> =
      questionContainer.querySelectorAll(".qtext table");
    for (const table of tables) {
      question = question.replace(table.textContent, htmlTableToString(table));
    }
  }

  const finalQuestion = `Give a short response as possible for this question, reply in ${
    config.langage && config.langage !== ""
      ? 'this langage "' + config.langage + '"'
      : "the following question langage"
  } and only show the result: 
      ${question} 
      (If you have to choose between multiple results only show the corrects one, separate them with new line and take the same text as the question)`;
  return normalizeText(finalQuestion);
}

export default normalizeQuestion;
