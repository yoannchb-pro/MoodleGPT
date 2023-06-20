/**
 * Normlize text
 * @param text
 */
function normalizeText(text: string, toLowerCase: boolean = true) {
  let normalizedText = text
    .replace(/\n+/gi, "\n") //remove duplicate new lines
    .replace(/(\n\s*\n)+/g, "\n") //remove useless white sapce from textcontent
    .replace(/[ \t]+/gi, " "); //replace multiples space or tabs by a space

  if (toLowerCase) normalizedText = normalizedText.toLowerCase();

  return (
    normalizedText
      .trim()
      /* We remove that because sometimes ChatGPT will reply: "answer d" */
      .replace(/^[a-z\d]\.\s/gi, "") //a. text, b. text, c. text, 1. text, 2. text, 3.text
      .replace(/\n[a-z\d]\.\s/gi, "\n") //same but with new line
  );
}

export default normalizeText;
