import * as p from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";
import { createGateway } from "@ai-sdk/gateway";
import { generateText, stepCountIs, type ModelMessage } from "ai";

import { getVercelTools } from "../utils/vercel.js";

export type VercelChatParams = {
  apiKey: string;
  modelId: string;
  systemInstruction: string;
};

const MAX_AGENT_STEPS = 12;

/**
 * Interactive REPL using Vercel AI Gateway + AI SDK `generateText` (multi-step tool loop).
 */
export async function runVercelGatewayChatLoop(
  params: VercelChatParams,
): Promise<void> {
  const vercelTools = getVercelTools();
  const gateway = createGateway({ apiKey: params.apiKey });
  const messages: ModelMessage[] = [];

  while (true) {
    const userInput = await p.text({
      message: pc.white("You:"),
      placeholder: "e.g. What's my SOL balance?",
      validate: (value) => {
        if (!value) return "Please enter a message";
      },
    });

    if (p.isCancel(userInput)) {
      p.outro("Kiro signing off. See you later!");
      break;
    }

    messages.push({ role: "user", content: userInput as string });
    const thinking = ora("Thinking...").start();

    try {
      const result = await generateText({
        model: gateway(params.modelId),
        system: params.systemInstruction,
        messages,
        tools: vercelTools,
        stopWhen: stepCountIs(MAX_AGENT_STEPS),
      });

      thinking.stop();
      messages.push(...result.response.messages);
      p.log.message(`${pc.cyan("Kiro:")} ${result.text}`);
    } catch (error: unknown) {
      thinking.stop();
      const msg = error instanceof Error ? error.message : String(error);
      p.log.error(`Something went wrong: ${msg}`);
    }
  }
}
