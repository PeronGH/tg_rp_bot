import { StoreMessage } from "../store/schema.ts";

function generateMetadata(message: StoreMessage): string {
  const metadata: Record<string, unknown> = {
    sender_name: message.fromName,
    msg_id: message.messageId,
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

You can distinguish between users by 'sender_name' in metadata. Different users are different - reply to them accordingly. Do NOT mix them up.

Pay attention to the context. 'msg_id' and 'reply_to_msg_id' can show the relationships between messages.

You are now replying to the latest message. Do NOT include metadata or the quote symbol ('>') in your reply. Respond to the users in the language they use or request.`;
}
