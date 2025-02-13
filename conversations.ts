import { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import type { Content } from "@google/generative-ai";

export async function generalChat(conversation: Conversation, ctx: Context) {
  const history: Content[] = [];

  for (;;) {
    const userMessage = ctx.message!;

    history.push({ role: "user", parts: [{ text: userMessage.text! }] });
    const lastBotMessage = await ctx.reply(
      `Number of Elements in history: ${history.length}`,
      {
        reply_parameters: {
          message_id: userMessage.message_id,
        },
      },
    );
    await conversation.external(() => console.log(history));
    history.push({ role: "model", parts: [{ text: lastBotMessage.text! }] });

    ctx = await conversation.waitForReplyTo(lastBotMessage.message_id!);
  }
}
