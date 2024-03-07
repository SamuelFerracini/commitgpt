// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import { Configuration, OpenAIApi } from "openai";
import { getApiKey, getPromptOptions } from "./config.js";

const configuration = new Configuration({
  apiKey: await getApiKey(),
});
const openai = new OpenAIApi(configuration);

export class ChatGPTClient {
  async getAnswer(content: string): Promise<string> {
    const { model, maxTokens, temperature } = await getPromptOptions();

    try {
      const result = await openai.createChatCompletion({
        model,
        messages: [{ role: "user", content }],
        max_tokens: maxTokens,
        temperature,
      });
      return result.data.choices[0].message.content;
    } catch (e) {
      console.error(e?.response ?? e);
      throw e;
    }
  }
}
