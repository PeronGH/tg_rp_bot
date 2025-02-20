import { StoreMessage } from "../store/schema.ts";

function generateMetadata(message: StoreMessage): string {
  const metadata: Record<string, unknown> = {
    msg_id: message.messageId,
    sender_name: message.fromName,
  };

  if (message.replyToMessageId) {
    metadata["reply_to_msg_id"] = message.replyToMessageId;
  }

  return JSON.stringify(metadata);
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

The first line of each message is a JSON representing its metadata. The rest of the message is the quoted message content.

You are now replying to the latest message. Pay attention to its context. Do NOT include metadata or the quote symbol ('>') in your reply. Respond to the users in the language they use or request.`;
}
