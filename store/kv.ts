import {
  StoreMessageData,
  storeMessageDataSchema,
  StoreMessageParams,
  storeMessageParamsSchema,
} from "./schema.ts";

const kv = await Deno.openKv();

function chatMessageKey(chatId: number, messageId: number): Deno.KvKey {
  return ["chats", chatId, "messages", messageId];
}

export async function writeMessage(params: StoreMessageParams) {
  const validated = storeMessageParamsSchema.parse(params);
  const key = chatMessageKey(validated.chatId, validated.messageId);
  const data = storeMessageDataSchema.parse(validated);
  await kv.set(key, data);
}

export async function readMessage(chatId: number, messageId: number) {
  const key = chatMessageKey(chatId, messageId);
  const result = await kv.get<StoreMessageData>(key);
  return result.value;
}
