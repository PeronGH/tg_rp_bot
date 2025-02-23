import type { Message } from "grammy/types";
import { StoreMessage, storeMessageSchema } from "./schema.ts";

export function toStoreMessageSafe(
  { message_id, from, reply_to_message, text, caption, chat, photo }: Message,
) {
  const storeMsg = {
    chatId: chat.id,
    messageId: message_id,
    fromName: formatName(from?.first_name, from?.last_name) ?? "Unknown",
    fromId: from?.id,
    text: text ?? caption ?? "",
    replyToMessageId: reply_to_message?.message_id, // TODO: fix potential bug with forwarded message (unsure if the bug exists)
    photoIdList: photo?.map(({ file_id }) => file_id),
  };
  return storeMessageSchema.safeParse(storeMsg);
}

export function toStoreMessage(msg: Message): StoreMessage {
  const result = toStoreMessageSafe(msg);
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
