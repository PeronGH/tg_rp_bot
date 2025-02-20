import { StoreMessage } from "../store/schema.ts";

function generateMetadata(message: StoreMessage): string {
  return `${message.messageId}. ` +
    `${JSON.stringify(message.fromName)} ` +
    (message.replyToMessageId
      ? `replied to ${message.replyToMessageId}:`
      : `said:`);
}

function quoteText(text: string): string {
  return text.split("\n").map((line) => `> ${line}`).join("\n");
}

function formatMessage(message: StoreMessage): string {
  return `${generateMetadata(message)}\n${quoteText(message.text)}`;
}

export function generatePrompt(messages: StoreMessage[]) {
  return `Here are a list of relevant Telegram messages:

${messages.map(formatMessage).join("\n\n")}

---

The first line of each message is its metadata. The rest of the message is the quoted message content.

You can distinguish between users by the metadata. Different users are different - reply to them accordingly. Do NOT mix them up.

Pay attention to the context. The ids of the message can show the relationships between messages.

You are now replying to the latest message. Do NOT include metadata or the quote symbol ('>') in your reply. Respond to the users in the language they use or request.`;
}
