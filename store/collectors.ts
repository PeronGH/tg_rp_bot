import { readMessage } from "./kv.ts";
import { StoreMessage } from "./schema.ts";

export async function collectReplyChain(messages: StoreMessage[]) {
  const collected = new Map<number, StoreMessage>(); // messageId => StoreMessage

  async function process(message: StoreMessage) {
    // Skip if already collected
    if (collected.has(message.messageId)) return;

    // Process reply chian of current message
    if (message.replyToMessageId && !collected.has(message.replyToMessageId)) {
      const repliedMessage = await readMessage(
        message.chatId,
        message.replyToMessageId,
      );
      if (repliedMessage) {
        await process({
          chatId: message.chatId,
          messageId: message.replyToMessageId,
          ...repliedMessage,
        });
      }
    }

    // Add current message
    collected.set(message.messageId, message);
  }

  for (const message of messages) {
    await process(message);
  }

  return [...collected.values()].sort((a, b) => a.messageId - b.messageId);
}
