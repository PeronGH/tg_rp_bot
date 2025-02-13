import "@std/dotenv/load";
import { $ } from "@david/dax";

function getRequiredEnv(variableName: string): string {
  const value = Deno.env.get(variableName);
  if (!value) {
    $.logError("Error", `${variableName} is not set`);
    Deno.exit(1);
  }
  return value;
}

export const TG_BOT_TOKEN = getRequiredEnv("TG_BOT_TOKEN");
export const OPENAI_API_KEY = getRequiredEnv("OPENAI_API_KEY");
export const OPENAI_MODEL = getRequiredEnv("OPENAI_MODEL");

export const OPENAI_BASE_URL = Deno.env.get("OPENAI_BASE_URL");
export const SYSTEM_INSTRUCTION = Deno.env.get("SYSTEM_INSTRUCTION");
