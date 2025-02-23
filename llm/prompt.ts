import { fetchFileAsDataUrl } from "../bot/api.ts";
import { StoreMessage } from "../store/schema.ts";
import { MessageContent } from "./generate.ts";

const finalPrompt =
  `You are now chatting with people on Telegram. The following is a list of relevant Telegram messages.

The first line of each message contains its metadata. The remaining lines represent the message content as it was originally written.

Pay attention to the context. The message IDs can reveal the relationships between them.

You can distinguish between users by examining the metadata. Different users are distinct, so reply to them accordingly. Do NOT confuse them.

You are now replying to the latest message. Do NOT include metadata in your reply. Respond to the users in the language they use or request.`;

function generateMetadata(message: StoreMessage): string {
  return `${message.messageId}. ` +
    `${JSON.stringify(message.fromName)} ` +
    (message.replyToMessageId
      ? `replied to ${message.replyToMessageId}:`
      : `said:`);
}

function formatMessage(message: StoreMessage): string {
  return `${generateMetadata(message)}\n${message.text}`;
}

export async function generatePrompt(
  messages: StoreMessage[],
): Promise<MessageContent[]> {
  const contents: MessageContent[] = [];

  for (const message of messages) {
    contents.push({ type: "text", text: formatMessage(message) });
    if (message.photoId) {
      const base64Image =
        (await fetchFileAsDataUrl(message.photoId)).split(",")[1];

      contents.push({
        type: "image_url",
        image_url: {
          "url": `data:image/jpeg;base64,${base64Image}`,
        },
      });
    }
  }

  contents.push({ type: "text", text: finalPrompt });

  return contents;
}
