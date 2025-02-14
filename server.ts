import { webhookCallback } from "grammy";
import { bot } from "./bot/bot.ts";
import { TG_BOT_SECRET_TOKEN } from "./env.ts";
import ipRangeCheck from "ip-range-check";

const ALLOWED_SUBNETS = [
  "149.154.160.0/20",
  "91.108.4.0/22",
];

const handler = webhookCallback(bot, "std/http", {
  secretToken: TG_BOT_SECRET_TOKEN,
});

Deno.serve(
  async (req, info) => {
    // Filter requests first
    // - Only POST is allowed
    if (req.method !== "POST") {
      return new Response("405 Method Not Allowed", { status: 405 });
    }
    // - Only allow requests from Telegram subnets
    if (!ipRangeCheck(info.remoteAddr.hostname, ALLOWED_SUBNETS)) {
      return new Response("401 Unauthorized", { status: 401 });
    }

    try {
      return await handler(req);
    } catch (error) {
      console.error("CaughtError:", error);
      return new Response("500 Internal Error", { status: 500 });
    }
  },
);
