import { z } from "zod";

export const storeMessageDataSchema = z.object({
  text: z.string(),
  replyToMessageId: z.number().nullish(),
  fromName: z.string(),
  fromId: z.number(),
  photoId: z.string().nullish(),
});

export const storeMessageSchema = storeMessageDataSchema.extend({
  messageId: z.number(),
  chatId: z.number(),
}).refine((message) => message.text || message.photoId, {
  message: "Either text or photoId must be present",
});

export type StoreMessageData = z.infer<typeof storeMessageDataSchema>;
export type StoreMessage = z.infer<typeof storeMessageSchema>;
