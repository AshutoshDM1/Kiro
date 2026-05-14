import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import pc from "picocolors";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: number;
}

const HISTORY_DIR = path.join(os.homedir(), ".kiro");
const HISTORY_FILE = path.join(HISTORY_DIR, "chat-history.json");

export function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

export function saveChatHistory(messages: ChatMessage[]) {
  ensureHistoryDir();
  const data = JSON.stringify(messages, null, 2);
  fs.writeFileSync(HISTORY_FILE, data, "utf-8");
}

export function loadChatHistory(): ChatMessage[] | null {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(pc.yellow("Warning: Failed to load chat history"), error);
  }
  return null;
}

export function clearChatHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      fs.unlinkSync(HISTORY_FILE);
    }
  } catch (error) {
    console.error(pc.yellow("Warning: Failed to clear chat history"), error);
  }
}

export function printChatHistory(messages: ChatMessage[]) {
  if (messages.length === 0) return;

  console.log(pc.cyan("\n--- Chat History ---\n"));
  for (const msg of messages) {
    const roleLabel = msg.role === "user" ? "You" : "Kiro";
    const time = new Date(msg.timestamp).toLocaleString();
    console.log(pc.gray(`[${time}] ${roleLabel}:`));
    console.log(msg.content + "\n");
  }
  console.log(pc.cyan("--- End History ---\n"));
}

export function getRecentMessagesForAI(
  messages: ChatMessage[],
  maxMessages: number = 10,
): ChatMessage[] {
  return messages.slice(-maxMessages);
}