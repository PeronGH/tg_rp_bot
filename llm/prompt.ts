import { StoreMessage } from "../store/schema.ts";
import { MessageContent } from "./generate.ts";

const finalPrompt =
  `You are now chatting with people on Telegram. The above is a list of relevant Telegram messages.

The first line of each message is its metadata. Pay attention to the context. The IDs of the messages can show the relationships between them. You can distinguish between users by the metadata. Different users are different - reply to them accordingly. Do NOT mix them up.

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

export function generatePrompt(messages: StoreMessage[]): MessageContent[] {
  return [
    ...messages.map((message) => ({
      type: "text",
      text: formatMessage(message),
    } as const)),
    { type: "text", text: finalPrompt },
  ];
}
