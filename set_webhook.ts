import "@std/dotenv/load";
import { Bot } from "grammy";

const botToken = Deno.env.get("TG_BOT_TOKEN") ?? prompt("Bot Token:");
if (!botToken) {
  throw new Error("Bot token is not provided");
}

const bot = new Bot(botToken);

const endpoint = Deno.args[0] ?? prompt("Webhook Endpoint:");

await bot.api.setWebhook(endpoint);

console.log("Webhook Endpoint is successfully set");
