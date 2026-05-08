import * as p from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";
import gradient from "gradient-string";
import boxen from "boxen";
import { getModel } from "./utils/gemini.js";
import { tools, skillHandlers } from "./skills/index.js";
import { getLinkedWallet } from "./utils/wallet.js";

export async function runAgent() {
  // Check for reset flag
  if (process.argv.includes("--reset")) {
    const { clearConfig } = await import("./utils/config.js");
    clearConfig();
    console.log(pc.green("✔") + " Configuration cleared successfully!\n");
  }

  console.log("\n" + gradient.atlas.multiline("  KIRO - SOLANA AI AGENT  ") + "\n");

  // 1. Link Wallet check
  const spinner = ora("Checking wallet connection...").start();
  let wallet = await getLinkedWallet();
  spinner.stop();

  if (!wallet) {
    p.note("No Solana wallet found in your CLI config.", "Wallet Link Required");
    const action = await p.select({
      message: "How would you like to proceed?",
      options: [
        { value: "exit", label: "Exit and configure solana-cli first" },
      ]
    });

    if (action === "exit") {
      p.outro("Goodbye! Run `solana-keygen new` or `solana config set --keypair <path>` to get started.");
      return;
    }
  }

  // 2. BYOK & Model Selection
  const { getConfig, setConfig } = await import("./utils/config.js");
  let { geminiApiKey, modelName } = getConfig();

  if (!geminiApiKey) {
    p.log.info(pc.blue("We support BYOK please setup Gemini API Key"));
    const authMethod = await p.select({
      message: "How would you like to authenticate?",
      options: [
        { value: "shared", label: "Use Community Shared Key (Quick Start)" },
        { value: "personal", label: "Set my own Gemini API Key (Recommended)" },
      ],
    });

    if (p.isCancel(authMethod)) return;

    if (authMethod === "shared") {
      setConfig({ useSharedKey: true });
      p.log.success("Using community shared key.");
      // Refresh config to get the shared key
      const updatedConfig = getConfig();
      geminiApiKey = updatedConfig.geminiApiKey;
    } else {
      const key = await p.password({
        message: "Please enter your Gemini API Key:",
        validate: (value) => {
          if (!value || value.length < 10) return "Invalid API Key";
        },
      });
      if (p.isCancel(key)) return;
      setConfig({ geminiApiKey: key, useSharedKey: false });
      geminiApiKey = key;
      p.log.success("Personal API Key saved!");
    }
  }

  const changeModel = await p.confirm({
    message: `Current model: ${pc.cyan(modelName)}. Want to change it?`,
    initialValue: false,
  });

  if (changeModel) {
    const model = await p.select({
      message: "Select Gemini Model",
      options: [
        { value: "gemma-4-26b-a4b-it", label: "Gemma 4 26B A4B IT" },
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast & Efficient)" },
        { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (Next-Gen)" },
      ],
    });
    if (!p.isCancel(model)) {
      modelName = model as string;
      setConfig({ modelName });
    }
  }

  if (wallet) {
    console.log(
      boxen(
        `${pc.cyan("Kiro Session Initialized")}\n\n` +
        `${pc.green("Address:")} ${wallet.publicKey}\n` +
        `${pc.green("Model:")}   ${modelName}`,
        { padding: 1, margin: 1, borderStyle: "round", borderColor: "cyan" }
      )
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

  const agentModel = getModel(systemInstruction);

  const chat = agentModel.startChat({
    history: [],
    tools: tools as any,
  });

  p.log.info(pc.cyan("I'm ready! What would you like to do?"));

  while (true) {
    const userInput = await p.text({
      message: pc.white("You:"),
      placeholder: "e.g. What's my balance?",
      validate: (value) => {
        if (!value) return "Please enter a message";
      }
    });

    if (p.isCancel(userInput)) {
      p.outro("Kiro signing off. See you later!");
      break;
    }

    const thinking = ora("Thinking...").start();

    try {
      let result = await chat.sendMessage(userInput as string);
      let response = result.response;

      // Tool use loop
      while (response.candidates?.[0]?.content?.parts?.some(part => part.functionCall)) {
        const calls = response.candidates[0].content.parts.filter(part => part.functionCall);
        
        thinking.text = "Executing skills...";
        
        const toolResults = await Promise.all(calls.map(async (call) => {
          const functionCall = call.functionCall!;
          const handler = skillHandlers[functionCall.name];
          
          if (handler) {
            const output = await handler(functionCall.args);
            return {
              functionResponse: {
                name: functionCall.name,
                response: output
              }
            };
          }
          return {
            functionResponse: {
              name: functionCall.name,
              response: { error: "Function not found" }
            }
          };
        }));

        result = await chat.sendMessage(toolResults as any);
        response = result.response;
      }

      thinking.stop();
      
      const text = response.text();
      p.log.message(`${pc.cyan("Kiro:")} ${text}`);

    } catch (error: any) {
      thinking.stop();
      p.log.error(`Something went wrong: ${error.message}`);
    }
  }
}
