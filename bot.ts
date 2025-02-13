import { Bot, Context } from "grammy";
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { TG_BOT_TOKEN } from "./env.ts";
import { generalChat } from "./conversations.ts";

export const bot = new Bot<ConversationFlavor<Context>>(TG_BOT_TOKEN);

bot.use(conversations());

bot.use(createConversation(generalChat));

await bot.init();
console.log("Bot is successfully initialized");

bot.hears(new RegExp(`@${bot.botInfo.username}\\b`), async (ctx) => {
  await ctx.conversation.enter("generalChat");
});
