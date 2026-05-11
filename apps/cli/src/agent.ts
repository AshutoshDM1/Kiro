import * as p from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";
import gradient from "gradient-string";
import boxen from "boxen";

import { runFirstRunWizardIfNeeded } from "./agent/first-run-setup.js";
import { runVercelGatewayChatLoop } from "./agent/vercel-chat.js";
import { tools, skillHandlers } from "./skills/index.js";
import { getModel } from "./utils/gemini.js";
import { getConfig } from "./utils/config.js";
import { getLinkedWallet } from "./utils/wallet.js";

export async function runAgent() {
  console.log(
    "\n" + gradient.atlas.multiline("  KIRO - SOLANA AI AGENT  ") + "\n",
  );

  const spinner = ora("Checking wallet connection...").start();
  const wallet = await getLinkedWallet();
  spinner.stop();

  if (!wallet) {
    p.note(
      "No Solana wallet found in your CLI config.",
      "Wallet Link Required",
    );
    const action = await p.select({
      message: "How would you like to proceed?",
      options: [
        { value: "exit", label: "Exit and configure solana-cli first" },
      ],
    });

    if (action === "exit") {
      p.outro(
        "Goodbye! Run `solana-keygen new` or `solana config set --keypair <path>` to get started.",
      );
      return;
    }
  }

  const ok = await runFirstRunWizardIfNeeded();
  if (!ok) {
    p.outro("Setup cancelled.");
    return;
  }

  const config = getConfig();

  if (config.agentType === "vercel-ai" && !config.vercelApiKey?.trim()) {
    p.log.error(
      "No Vercel AI Gateway API key found. Run `kiro config clear` and set up again, or set VERCEL_AI_KEY / AI_GATEWAY_API_KEY.",
    );
    return;
  }

  if (wallet) {
    console.log(
      boxen(
        `${pc.cyan("Kiro Session Initialized")}\n\n` +
          `${pc.green("Agent:")}   ${config.agentType}\n` +
          `${pc.green("Address:")} ${wallet.publicKey}\n` +
          `${pc.green("Model:")}   ${config.agentType === "gemini" ? config.modelName : config.vercelModelName}`,
        { padding: 1, margin: 1, borderStyle: "round", borderColor: "cyan" },
      ),
    );
  }

  const systemInstruction = `You are Kiro, a high-performance Solana AI Agent.

USER CONTEXT:
- Linked Wallet: ${wallet?.publicKey || "NONE"}
- Default Network: devnet

OPERATIONAL RULES:
1. Use 'get_balance' for all balance inquiries. 
2. If the user says "my balance", use the Linked Wallet address: ${wallet?.publicKey}.
3. If the user asks about their wallet or public key, use the Linked Wallet info.
4. If a tool call fails, explain why clearly.
5. Do not hallucinate balances. Use tools.`;

  p.log.info(pc.cyan("I'm ready! What would you like to do?"));

  if (config.agentType === "vercel-ai") {
    await runVercelGatewayChatLoop({
      apiKey: config.vercelApiKey!,
      modelId: config.vercelModelName,
      systemInstruction,
    });
    return;
  }

  const agentModel = getModel(systemInstruction);
  const chat = agentModel.startChat({
    history: [],
    tools: tools as never,
  });

  while (true) {
    const userInput = await p.text({
      message: pc.white("You:"),
      placeholder: "e.g. What's my balance?",
      validate: (value) => {
        if (!value) return "Please enter a message";
      },
    });

    if (p.isCancel(userInput)) {
      p.outro("Kiro signing off. See you later!");
      break;
    }

    const thinking = ora("Thinking...").start();

    try {
      let result = await chat.sendMessage(userInput as string);
      let response = result.response;

      while (
        response.candidates?.[0]?.content?.parts?.some(
          (part) => part.functionCall,
        )
      ) {
        const calls = response.candidates[0].content.parts.filter(
          (part) => part.functionCall,
        );

        thinking.text = "Executing skills...";

        const toolResults = await Promise.all(
          calls.map(async (call) => {
            const functionCall = call.functionCall!;
            const handler = skillHandlers[functionCall.name];

            if (handler) {
              const output = await handler(functionCall.args);
              return {
                functionResponse: {
                  name: functionCall.name,
                  response: output,
                },
              };
            }
            return {
              functionResponse: {
                name: functionCall.name,
                response: { error: "Function not found" },
              },
            };
          }),
        );

        result = await chat.sendMessage(toolResults as never);
        response = result.response;
      }

      thinking.stop();

      const text = response.text();
      p.log.message(`${pc.cyan("Kiro:")} ${text}`);
    } catch (error: unknown) {
      thinking.stop();
      const msg = error instanceof Error ? error.message : String(error);
      p.log.error(`Something went wrong: ${msg}`);
    }
  }
}
