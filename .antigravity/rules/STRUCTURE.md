# Kiro CLI Architecture & Modularity Guide

Kiro is designed with a **Skill-First** modular architecture. This allows the AI agent to grow by simply adding new capabilities (skills) without touching the core agent logic.

## 📂 Project Structure

```bash
src/
├── index.ts          # Entry point: Triggers the agent loop
├── agent.ts          # Core Agent: Manages UI (@clack/prompts), Gemini Chat, and Tool execution loop
├── skills/           # AI Capabilities (Tools)
│   ├── index.ts      # Skill Registry: The central hub for all AI tools
│   ├── balance.ts    # Solana balance fetching logic
│   └── wallet.ts     # Local wallet info access
└── utils/            # Shared Logic
    ├── gemini.ts     # Gemini SDK initialization and model factory
    ├── wallet.ts     # Wallet detection and path resolution
    └── network.ts    # Solana RPC and Network constants
```

---

## 🛠 How to Add a New Skill (Modular Way)

Follow these 3 steps to give Kiro a new superpower:

### 1. Create the Skill File
Create a new file in `src/skills/` (e.g., `transfer.ts`). 
It must export two things:
- A **Function**: The actual TypeScript code that performs the action.
- A **Tool Schema**: The JSON definition that tells Gemini what the tool does and what parameters it needs.

```typescript
// src/skills/transfer.ts
export const transferTool = {
  name: "transfer_sol",
  description: "Transfer SOL from the linked wallet to another address",
  parameters: {
    type: "OBJECT",
    properties: {
      to: { type: "STRING", description: "Recipient address" },
      amount: { type: "NUMBER", description: "Amount of SOL to send" }
    },
    required: ["to", "amount"]
  }
};

export async function transferSol(to: string, amount: number) {
  // Logic here...
  return { success: true, txId: "..." };
}
```

### 2. Register in the Skill Registry
Open `src/skills/index.ts` and add your new skill to the `tools` array and `skillHandlers` object.

```typescript
// src/skills/index.ts
import { transferSol, transferTool } from "./transfer.js";

export const tools = [
  {
    functionDeclarations: [
      getBalanceTool, 
      getWalletInfoTool,
      transferTool // Add here
    ]
  }
];

export const skillHandlers: Record<string, Function> = {
  get_balance: (args) => getBalance(args.address, args.network),
  get_wallet_info: () => getWalletInfo(),
  transfer_sol: (args) => transferSol(args.to, args.amount) // Add here
};
```

### 3. That's it!
Kiro will automatically detect the new tool on the next run. Because it's a "Reasoning Agent", it will decide when to use `transfer_sol` based on the user's natural language input.

---

## 🎨 UI & Aesthetics
Always use the tools in `utils` for consistent styling:
- **`picocolors`**: For terminal colors.
- **`ora`**: For loading states while skills are executing.
- **`boxen`**: For framing important data like wallet addresses or success receipts.
- **`@clack/prompts`**: For interactive user input.
