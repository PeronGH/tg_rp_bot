import "@std/dotenv/load";

function getRequiredEnv(variableName: string): string {
  const value = Deno.env.get(variableName);
  if (!value) {
    throw new Error(`${variableName} is not set!`);
  }
  return value;
}

export const TG_BOT_TOKEN = getRequiredEnv("TG_BOT_TOKEN");
export const GEMINI_API_KEY = getRequiredEnv("GEMINI_API_KEY");
export const GEMINI_TEXT_MODEL = getRequiredEnv("GEMINI_TEXT_MODEL");

export const GEMINI_BASE_URL = Deno.env.get("GEMINI_BASE_URL");
export const TG_BOT_SECRET_TOKEN = Deno.env.get("TG_BOT_SECRET_TOKEN");
export const SYSTEM_INSTRUCTION = Deno.env.get("SYSTEM_INSTRUCTION");
export const AUDIO_INSTRUCTION = Deno.env.get("AUDIO_INSTRUCTION");
export const GEMINI_AUDIO_MODEL = Deno.env.get("GEMINI_AUDIO_MODEL");
export const GEMINI_AUDIO_VOICE = Deno.env.get("GEMINI_AUDIO_VOICE");
