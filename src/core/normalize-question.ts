import Config from "../types/config";
import normalizeText from "../utils/normalize-text";

/**
 * Normalize the question and add sub informations
 * @param langage
 * @param question
 * @returns
 */
function normalizeQuestion(langage: Config["langage"], question: string) {
  const finalQuestion = `Give a short response as possible for this question, reply in ${
    langage && langage !== ""
      ? 'this langage "' + langage + '"'
      : "the following question langage"
  } and only show the result: 
      ${question} 
      (If you have to choose between multiple results only show the corrects one, separate them with new line and take the same text as the question)`;
  return normalizeText(finalQuestion);
}

export default normalizeQuestion;
