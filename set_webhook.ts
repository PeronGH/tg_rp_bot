import "@std/dotenv/load";
import { Bot } from "grammy";

const botToken = Deno.env.get("TG_BOT_TOKEN") ?? prompt("Bot Token:");
if (!botToken) {
  throw new Error("Bot token is not provided");
}

const bot = new Bot(botToken);

const endpoint = Deno.env.get("WEBHOOK_ENDPOINT") ??
  prompt("Webhook Endpoint:");
if (!endpoint) {
  throw new Error("Webhook endpoint is not provided");
}

const secretToken = Deno.env.get("TG_BOT_SECRET_TOKEN") ??
  prompt("Secret Token (^D to skip):") ?? undefined;

await bot.api.setWebhook(endpoint, { secret_token: secretToken });

console.info("Webhook Endpoint is successfully set");
