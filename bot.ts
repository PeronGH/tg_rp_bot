import { Bot } from "grammy";
import { TG_BOT_TOKEN } from "./env.ts";
import { toStoreMessage, toStoreMessageSafe } from "./store/converters.ts";
import { writeMessage } from "./store/kv.ts";
import { generate } from "./llm/openai.ts";
import { StoreMessageData } from "./store/schema.ts";
import { readMessage } from "./store/kv.ts";
import { createStoreMessageToChatMessageConverter } from "./llm/prompt.ts";

export const bot = new Bot(TG_BOT_TOKEN);

bot.on("message:text", async (ctx) => {
  // Store the user message first
  const userMsg = toStoreMessage(ctx.message);
  console.info("userMsg", userMsg);
  await writeMessage(userMsg);

  // Ensure it is either a direct reply to bot message
  // or a message includes @BotName
  if (
    ctx.message.reply_to_message?.from?.id !== bot.botInfo.id &&
    !ctx.message.text.includes(`@${bot.botInfo.username}`)
  ) return;

  // Reply to the message
  // - Gather messages
  const messages: StoreMessageData[] = [userMsg];
  while (messages[0].replyToMessageId) {
    const replyToMessageId = messages[0].replyToMessageId!;
    const repliedMessage = await readMessage(userMsg.chatId, replyToMessageId);
    if (!repliedMessage) {
      // Message is not in KV, but may be in `ctx.message.reply_to_message`
      if (messages[0] === userMsg) {
        const ctxRepliedMessage = toStoreMessageSafe(
          ctx.message.reply_to_message!,
        );
        if (!ctxRepliedMessage.success) {
          console.warn("UnableToConvert", ctx.message.reply_to_message);
          break;
        }
        console.info("ctxRepliedMessage", ctxRepliedMessage.data);
        await writeMessage(ctxRepliedMessage.data);
        messages.unshift(ctxRepliedMessage.data);
      }
      break;
    }
    messages.unshift(repliedMessage);
  }
  // - Generate reply
  const history = messages.map(
    createStoreMessageToChatMessageConverter(bot.botInfo.id),
  );
  console.info("history", history);
  const replyContent = await generate(history);
  // - Send reply
  const reply = await ctx.reply(replyContent, {
    reply_parameters: { message_id: userMsg.messageId },
  });

  // Store the reply message
  const replyMsg = toStoreMessage(reply);
  console.info("replyMsg", replyMsg);
  await writeMessage(replyMsg);
});

bot.on("edited_message:text", async (ctx) => {
  // Store the updated user message
  const editedMsg = toStoreMessage(ctx.editedMessage);
  console.info("editedMsg", editedMsg);
  await writeMessage(editedMsg);
});
