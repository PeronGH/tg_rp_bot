import {
  AUDIO_INSTRUCTION,
  GEMINI_API_KEY,
  GEMINI_AUDIO_MODEL,
  GEMINI_AUDIO_VOICE,
  GEMINI_BASE_URL,
  GEMINI_TEXT_MODEL,
  SYSTEM_INSTRUCTION,
} from "../env.ts";
import { GoogleGenAI, type Part } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: GEMINI_BASE_URL ? { baseUrl: GEMINI_BASE_URL } : undefined,
});

export type MessageContent = Part;
export type MessageOutput = {
  text: string;
  encodedAudio?: string; // Base64 encoded audio data
};

export async function generate(
  ...contents: MessageContent[]
): Promise<MessageOutput> {
  console.info("Generating text response...");
  const textResp = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  if (!textResp.text) {
    throw new Error("No text response from Gemini AI", { cause: textResp });
  }

  const output: MessageOutput = {
    text: textResp.text,
  };

  if (!(GEMINI_AUDIO_MODEL && GEMINI_AUDIO_VOICE)) {
    return output;
  }

  console.info("Generating audio response...");
  const audioResp = await ai.models.generateContent({
    model: GEMINI_AUDIO_MODEL,
    contents: [
      ...(AUDIO_INSTRUCTION ? [AUDIO_INSTRUCTION] : []),
      output.text,
    ],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: GEMINI_AUDIO_VOICE },
        },
      },
    },
  });

  const audioData = audioResp
    .candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioData) {
    console.warn("No audio data in Gemini AI response");
    return output;
  }

  output.encodedAudio = audioData;
  return output;
}
