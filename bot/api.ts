import { TG_BOT_TOKEN } from "../env.ts";
import { bot } from "./bot.ts";

function getFileUrlByPath(path: string) {
  return `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${path}`;
}

export async function fetchImageAsDataUrl(id: string): Promise<string> {
  const { file_path } = await bot.api.getFile(id);
  if (!file_path) throw new Error("File is not downloadable");
  console.debug("fetching file path:", file_path);

  const url = getFileUrlByPath(file_path);

  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
