import { Bot } from "grammy";
import { TG_BOT_TOKEN } from "../env.ts";
import { toStoreMessage, toStoreMessageSafe } from "../store/converters.ts";
import { listRecentMessages, writeMessage } from "../store/kv.ts";
import { generate } from "../llm/generate.ts";
import { StoreMessage } from "../store/schema.ts";
import { generatePrompt } from "../llm/prompt.ts";
import { collectReplyChain } from "../store/collectors.ts";

export const bot = new Bot(TG_BOT_TOKEN);

// Hacky implementation of a queue
const queue: (() => Promise<void>)[] = [];
async function processQueue() {
  try {
    await queue.shift()?.();
  } catch (error) {
    console.log("ErrorProcessingQueue:", error);
  } finally {
    setTimeout(processQueue);
  }
}
setTimeout(processQueue);

bot.on("message:text", async (ctx) => {
  // TODO: check if the chat id is in ALLOWED_CHAT_IDS

  // Store the user message first
  const userMsg = toStoreMessage(ctx.message);
  console.info("userMsg", userMsg);
  await writeMessage(userMsg);

  // Ensure it is either a direct reply to bot message
  // or a message includes @BotName
  if (
    userMsg.fromId !== bot.botInfo.id &&
    !userMsg.text.includes(`@${bot.botInfo.username}`)
  ) return;

  queue.push(async () => {
    let includeRecent = 0;
    // Check if recent messages should be included
    const matches = /^\/recent(\d+)/g.exec(userMsg.text);
    if (matches && matches[1]) {
      const nRecent = Number.parseInt(matches[1]);
      if (nRecent > 0) {
        includeRecent = nRecent;
      }
    }

    const initialMessages = includeRecent
      ? [
        ...(await listRecentMessages(userMsg.chatId, includeRecent)),
        userMsg,
      ]
      : [userMsg];

    // Reply to the message
    // - Gather messages
    const messages: StoreMessage[] = await collectReplyChain(initialMessages);
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
    const prompt = generatePrompt(messages);
    console.info("prompt", prompt);
    const replyContent = await generate(...prompt);
    // - Send reply
    const reply = await ctx.reply(replyContent, {
      reply_parameters: { message_id: userMsg.messageId },
    });

    // Store the reply message
    const replyMsg = toStoreMessage(reply);
    console.info("replyMsg", replyMsg);
    await writeMessage(replyMsg);
  });
});

bot.on("message:photo", async (ctx) => {
  // Store the user message with photo ids
  const userMsg = toStoreMessage(ctx.message);
  console.info("userMsg", userMsg);
  await writeMessage(userMsg);
});

bot.on(["edited_message:text", "edited_message:photo"], async (ctx) => {
  // Store the updated user message
  const editedMsg = toStoreMessage(ctx.editedMessage);
  console.info("editedMsg", editedMsg);
  await writeMessage(editedMsg);
});
