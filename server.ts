import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";

Deno.serve(webhookCallback(bot, "std/http"));
