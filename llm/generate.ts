import {
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  SYSTEM_INSTRUCTION,
} from "../env.ts";
import { generateText } from "@xsai/generate-text";
import type { UserMessage, UserMessagePart } from "@xsai/shared-chat";

export type MessageContent = UserMessagePart;

export async function generate(...contents: MessageContent[]): Promise<string> {
  const userMessage: UserMessage = { role: "user", content: contents };

  const { text } = await generateText({
    baseURL: OPENAI_BASE_URL,
    apiKey: OPENAI_API_KEY,
    model: OPENAI_MODEL,
    messages: SYSTEM_INSTRUCTION
      ? [{ role: "system", content: SYSTEM_INSTRUCTION }, userMessage]
      : [userMessage],
  });

  return text ?? "";
}
