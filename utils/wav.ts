import { Buffer } from "node:buffer";

export function createWavBuffer(
  pcmData: Buffer,
  channels = 1,
  sampleRate = 24000,
  bitDepth = 16,
): Buffer {
  const dataSize = pcmData.length;
  const fileSize = 36 + dataSize;

  const wavBuffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  wavBuffer.write("RIFF", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(fileSize, offset);
  offset += 4;
  wavBuffer.write("WAVE", offset);
  offset += 4;

  // fmt chunk
  wavBuffer.write("fmt ", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(16, offset);
  offset += 4; // chunk size
  wavBuffer.writeUInt16LE(1, offset);
  offset += 2; // audio format (PCM)
  wavBuffer.writeUInt16LE(channels, offset);
  offset += 2;
  wavBuffer.writeUInt32LE(sampleRate, offset);
  offset += 4;
  wavBuffer.writeUInt32LE(sampleRate * channels * bitDepth / 8, offset);
  offset += 4; // byte rate
  wavBuffer.writeUInt16LE(channels * bitDepth / 8, offset);
  offset += 2; // block align
  wavBuffer.writeUInt16LE(bitDepth, offset);
  offset += 2;

  // data chunk
  wavBuffer.write("data", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(dataSize, offset);
  offset += 4;
  pcmData.copy(wavBuffer, offset);

  return wavBuffer;
}
