import { z } from "zod";

export const storeMessageDataSchema = z.object({
  text: z.string(),
  replyToMessageId: z.number().nullish(),
  fromName: z.string(),
  fromId: z.number(),
});

export const storeMessageSchema = storeMessageDataSchema.extend({
  messageId: z.number(),
  chatId: z.number(),
});

export type StoreMessageData = z.infer<typeof storeMessageDataSchema>;
export type StoreMessage = z.infer<typeof storeMessageSchema>;
