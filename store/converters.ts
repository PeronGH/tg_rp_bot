import type { Message } from "grammy/types";
import { StoreMessageParams, storeMessageParamsSchema } from "./schema.ts";

export function toStoredMessageSafe(
  { message_id, from, reply_to_message, text, caption, chat }: Message,
) {
  const storeMsg = {
    chatId: chat.id,
    messageId: message_id,
    fromName: formatName(from?.first_name, from?.last_name) ?? "Unknown",
    fromId: from?.id,
    text: text ?? caption,
    replyToMessageId: reply_to_message?.message_id, // TODO: fix potential bug with forwarded message (unsure if the bug exists)
  };
  return storeMessageParamsSchema.safeParse(storeMsg);
}

export function toStoredMessage(msg: Message): StoreMessageParams {
  const result = toStoredMessageSafe(msg);
  if (!result.success) throw result.error;
  return result.data;
}

function formatName(
  firstName: string | undefined,
  lastName: string | undefined,
): string | undefined {
  // Both present
  if (firstName && lastName) return `${firstName} ${lastName}`;
  // Only first name
  if (firstName) return firstName;
  // Only last name
  if (lastName) return lastName;
}
