import { Bot } from "grammy";
import { TG_BOT_TOKEN } from "./env.ts";

const bot = new Bot(TG_BOT_TOKEN);

bot.start();
