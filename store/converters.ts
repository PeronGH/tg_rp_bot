import type { Message, PhotoSize } from "grammy/types";
import { StoreMessage, storeMessageSchema } from "./schema.ts";

export function toStoreMessageSafe(
  { message_id, from, reply_to_message, text, caption, chat, photo }: Message,
) {
  const storeMsg: Partial<StoreMessage> = {
    chatId: chat.id,
    messageId: message_id,
    fromName: formatName(from?.first_name, from?.last_name) ?? "Unknown",
    fromId: from?.id,
    text: text ?? caption ?? "",
    replyToMessageId: reply_to_message?.message_id, // TODO: fix potential bug with forwarded message (unsure if the bug exists)
    photoId: findPhotoId(photo ?? []),
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

function findPhotoId(sizes: PhotoSize[]): string | undefined {
  return sizes.slice(0, 3).reverse().at(0)?.file_id;
}
