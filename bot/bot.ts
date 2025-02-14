import { Bot } from "grammy";
import { TG_BOT_TOKEN } from "../env.ts";
import { toStoreMessage, toStoreMessageSafe } from "../store/converters.ts";
import { writeMessage } from "../store/kv.ts";
import { generate } from "../llm/openai.ts";
import { StoreMessage } from "../store/schema.ts";
import { readMessage } from "../store/kv.ts";
import { createStoreMessageToChatMessageConverter } from "../llm/prompt.ts";
import { collectReplyChain } from "../store/collectors.ts";

export const bot = new Bot(TG_BOT_TOKEN);

bot.on("message:text", async (ctx) => {
  // TODO: check if the chat id is in ALLOWED_CHAT_IDS

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
  const messages: StoreMessage[] = await collectReplyChain([userMsg]);
  getCtxRepliedMessage: {
    // - Special case: reply to uncached message, but that message is in ctx
    if (
      messages.length === 1 && messages[0] === userMsg &&
      ctx.message.reply_to_message
    ) {
      const ctxRepliedMessage = toStoreMessageSafe(
        ctx.message.reply_to_message!,
      );
      if (!ctxRepliedMessage.success) {
        console.warn("UnableToConvert", ctx.message.reply_to_message);
        break getCtxRepliedMessage;
      }
      console.info("ctxRepliedMessage", ctxRepliedMessage.data);
      await writeMessage(ctxRepliedMessage.data);
      messages.unshift(ctxRepliedMessage.data);
    }
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
