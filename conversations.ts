import { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import type { Content } from "@google/generative-ai";

export async function generalChat(conversation: Conversation, ctx: Context) {
  const history: Content[] = [];

  for (;;) {
    history.push({ role: "user", parts: [{ text: ctx.message?.text! }] });
    const lastBotMessage = await ctx.reply(
      `Number of Elements in history: ${history.length}`,
    );
    console.log(history);
    history.push({ role: "model", parts: [{ text: lastBotMessage.text! }] });

    ctx = await conversation.waitForReplyTo(lastBotMessage.message_id!);
  }
}
