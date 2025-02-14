import {
  StoreMessage,
  StoreMessageData,
  storeMessageDataSchema,
  storeMessageSchema,
} from "./schema.ts";

const kv = await Deno.openKv();

function chatMessagesPrefix(chatId: number): Deno.KvKey {
  return ["chats", chatId, "messages"];
}

function chatMessageKey(chatId: number, messageId: number): Deno.KvKey {
  return [...chatMessagesPrefix(chatId), messageId];
}

export async function writeMessage(msg: StoreMessage) {
  const validated = storeMessageSchema.parse(msg);
  const key = chatMessageKey(validated.chatId, validated.messageId);
  const data = storeMessageDataSchema.parse(validated);
  await kv.set(key, data);
}

export async function readMessage(chatId: number, messageId: number) {
  const key = chatMessageKey(chatId, messageId);
  const result = await kv.get<StoreMessageData>(key);
  return result.value;
}

export async function listRecentMessages(
  chatId: number,
  n: number,
): Promise<StoreMessage[]> {
  const messages: StoreMessage[] = [];

  const entries = kv.list<StoreMessageData>(
    { prefix: chatMessagesPrefix(chatId) },
    {
      limit: n,
      reverse: true,
    },
  );

  for await (const entry of entries) {
    const messageId = entry.key[3] as number;
    messages.unshift({
      ...entry.value,
      chatId,
      messageId,
    });
  }

  return messages.reverse();
}
