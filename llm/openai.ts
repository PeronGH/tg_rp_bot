import {
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  SYSTEM_INSTRUCTION,
} from "../env.ts";
import { OpenAI } from "@openai/openai";

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const client = new OpenAI(
  { apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL },
);

export async function generate(messages: ChatMessage[]) {
  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: SYSTEM_INSTRUCTION
      ? [{ role: "system", content: SYSTEM_INSTRUCTION }, ...messages]
      : messages,
    top_p: 0.95,
  });

  const message = response.choices[0].message;

  return message.content ?? message.refusal ?? "";
}
