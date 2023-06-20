import Config from "../types/config";
import GPTAnswer from "../types/gptAnswer";
import normalizeText from "../utils/normalize-text";

/**
 * Get the response from chatGPT api
 * @param config
 * @param question
 * @returns
 */
async function getChatGPTResponse(
  config: Config,
  question: string
): Promise<GPTAnswer> {
  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 15000);
  const req = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: config.timeout ? controller.signal : null,
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `
Follow those rules:
- Sometimes there won't be a question, so just answer the statement as you normally would without following the other rules and give the most detailled and complete answer with explication.
- Your goal is to understand the statement and to reply to each question by giving only the answer.
- You will keep the same order for the answers as it's asked event if it's a put in order question. Never change the order of the response for each questions.
- You will separate all the answer with new lines and only show the correctes one.
- You will onyl give the answers for each question and omit the questions, statement, title or other informations from the response.
- You will only give answer with exactly the same text as the gived answers.
- The question always have the good answer so you should always give an answer to the question.
- You will always respond in the same langage as the user question.`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.8,
      top_p: 1.0,
      presence_penalty: 1.0,
      stop: null,
    }),
  });
  clearTimeout(timeoutControler);
  const rep = await req.json();
  const response = rep.choices[0].message.content;
  return {
    response,
    normalizedResponse: normalizeText(response),
  };
}

export default getChatGPTResponse;
