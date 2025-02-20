import { StoreMessage } from "../store/schema.ts";
import { ChatMessage } from "./openai.ts";

export type StoreMessageToChatMessageConverter = (
  storeMsg: StoreMessage,
) => ChatMessage;

export function createStoreMessageToChatMessageConverter(
  botId: number,
): StoreMessageToChatMessageConverter {
  return (storeMsg: StoreMessage) => {
    if (storeMsg.fromId === botId) {
      return {
        role: "assistant",
        content: storeMsg.text,
      };
    }
    const metadata = generateMetadata(storeMsg);
    return {
      role: "user",
      content: `${metadata}\n${storeMsg.text}`,
    };
  };
}

function generateMetadata(message: StoreMessage): string {
  const metadata: Record<string, unknown> = {
    msg_id: message.messageId,
    sender_name: message.fromName,
  };

  if (message.replyToMessageId) {
    metadata["reply_to_msg_id"] = message.replyToMessageId;
  }

  return JSON.stringify(metadata);
}
