import { StoreMessageData } from "../store/schema.ts";
import { ChatMessage } from "./openai.ts";

export type StoreMessageToChatMessageConverter = (
  storeMsg: StoreMessageData,
) => ChatMessage;

export function createStoreMessageToChatMessageConverter(
  botId: number,
): StoreMessageToChatMessageConverter {
  return (storeMsg: StoreMessageData) => {
    if (storeMsg.fromId === botId) {
      return {
        role: "assistant",
        content: storeMsg.text,
      };
    }
    const metadata = `[sender=${JSON.stringify(storeMsg.fromName)}]`;
    return {
      role: "user",
      content: `${metadata}\n${storeMsg.text}`,
    };
  };
}
