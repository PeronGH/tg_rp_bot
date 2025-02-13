import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";
import { TG_BOT_SECRET_TOKEN } from "./env.ts";

const handler = webhookCallback(bot, "std/http", {
  secretToken: TG_BOT_SECRET_TOKEN,
});

Deno.serve(
  async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("CaughtError:", error);
      return new Response("500 Internal Error", { status: 500 });
    }
  },
);
