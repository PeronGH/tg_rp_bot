import { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { ChatMessage, generate } from "./openai.ts";

export async function generalChat(conversation: Conversation, ctx: Context) {
  const history: ChatMessage[] = [];

  for (;;) {
    const userMessage = ctx.message!;

    history.push({ role: "user", content: userMessage.text! });

    const replyContent = await conversation.external(() => generate(history));
    const lastBotMessage = await ctx.reply(
      replyContent,
      {
        reply_parameters: {
          message_id: userMessage.message_id,
        },
        reply_markup: {
          force_reply: true,
        },
      },
    );
    await conversation.external(() => console.log(history));
    history.push({ role: "assistant", content: replyContent });

    ctx = await conversation.waitForReplyTo(lastBotMessage.message_id!);
  }
}
