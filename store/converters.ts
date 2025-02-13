import type { Message } from "grammy/types";
import { StoreMessageParams, storeMessageParamsSchema } from "./schema.ts";

export function toStoredMessageSafe(
  { chat, message_id, from, reply_to_message, text }: Message,
) {
  return storeMessageParamsSchema.safeParse({
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

export function toStoredMessage(msg: Message): StoreMessageParams {
  const result = toStoredMessageSafe(msg);
  if (!result.success) throw result.error;
  return result.data;
}
