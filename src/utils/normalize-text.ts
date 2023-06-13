/**
 * Normlize text
 * @param text
 */
function normalizeText(text: string) {
  return text
    .replace(/(\n\s*)+/gi, "\n")
    .replace(/[ \t]+/gi, " ")
    .toLowerCase()
    .trim()
    .replace(/^[a-z\d]\.\s/gi, "") //a. text, b. text, c. text, 1. text, 2. text, 3.text
    .replace(/\n[a-z\d]\.\s/gi, "\n"); //same but with new line
}

export default normalizeText;
