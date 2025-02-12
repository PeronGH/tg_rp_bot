import { Bot, Context } from "grammy";
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { TG_BOT_TOKEN } from "./env.ts";
import { generalChat } from "./conversations.ts";
import { $ } from "@david/dax";

const bot = new Bot<ConversationFlavor<Context>>(TG_BOT_TOKEN);

bot.use(conversations());

bot.use(createConversation(generalChat));

await bot.init();
$.logStep("Success", "Bot is successfully initialized");

bot.hears(new RegExp(`@${bot.botInfo.username}\\b`), async (ctx) => {
  await ctx.conversation.enter("generalChat");
});

await bot.start();
