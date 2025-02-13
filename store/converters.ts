import type { Message } from "grammy/types";
import { StoreMessageParams, storeMessageParamsSchema } from "./schema.ts";

export function toStoredMessage(
  { chat, message_id, from, reply_to_message, text }: Message,
): StoreMessageParams {
  return storeMessageParamsSchema.parse({
    chatId: chat.id,
    messageId: message_id,
    fromName: from?.last_name
      ? `${from.first_name} ${from.last_name}`
      : from?.first_name,
    fromId: from?.id,
    text,
    replyToMessageId: reply_to_message?.message_id, // TODO: fix potential bug with forwarded message (unsure if the bug exists)
  });
}
