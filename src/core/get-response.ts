import Config from "../types/config";
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
): Promise<string> {
  const req = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model:
        config.model && config.model !== "" ? config.model : "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
      temperature: 0.8,
      top_p: 1.0,
      presence_penalty: 1.0,
      stop: null,
    }),
  });
  const rep = await req.json();
  const response = rep.choices[0].message.content;
  return normalizeText(response);
}

export default getChatGPTResponse;
