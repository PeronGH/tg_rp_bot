import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";
import { TG_BOT_SECRET_TOKEN } from "./env.ts";

Deno.serve(
  webhookCallback(bot, "std/http", { secretToken: TG_BOT_SECRET_TOKEN }),
);
