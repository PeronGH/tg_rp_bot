import { GEMINI_API_KEY, GEMINI_MODEL, SYSTEM_INSTRUCTION } from "./env.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL,
  systemInstruction: SYSTEM_INSTRUCTION,
});

export const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
} as const;
