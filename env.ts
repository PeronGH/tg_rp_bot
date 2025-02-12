import "@std/dotenv/load";
import { $ } from "@david/dax";

function getRequiredEnv(variableName: string): string {
  const value = Deno.env.get(variableName);
  if (!value) {
    $.logError("MissingRequiredEnv", `${variableName} is not set`);
    Deno.exit(1);
  }
  return value;
}

export const TG_BOT_TOKEN = getRequiredEnv("TG_BOT_TOKEN");
export const GEMINI_API_KEY = getRequiredEnv("GEMINI_API_KEY");
export const SYSTEM_INSTRUCTION = Deno.env.get("SYSTEM_INSTRUCTION");
export const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ??
  "gemini-2.0-pro-exp-02-05";
