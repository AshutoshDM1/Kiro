<div align="center">
  <img src = "https://res.cloudinary.com/dnvl8mqba/image/upload/v1778347425/Kiro/f4c7f47e-70be-4925-9a37-f0ec956f356f.png" alt="Kiro - AI Solana Terminal" width = "100px" />

  # Kiro: AI-Powered Solana Terminal

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Solana](https://img.shields.io/badge/Solana-Web3-9945FF?logo=solana)](https://solana.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![pnpm](https://img.shields.io/badge/pnpm-Workspace-F69220?logo=pnpm)](https://pnpm.io/)
  [![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

  **The terminal-first assistant for the Solana Frontier.**  
  *Natural language intent. Deterministic execution. Uncompromising security.*
</div>

---

## 🚀 Vision

Kiro is a **terminal-first Solana assistant** designed to bridge the gap between human intent and blockchain execution. Instead of navigating complex UIs, users simply chat with Kiro in plain English to manage wallets, track portfolios, and execute transactions—all from the comfort of their favorite shell.

## ✨ Features

- **🤖 AI Agentic Core**: Powered by Google Gemini, Kiro converts natural language into precise tool calls.
- **🛡️ Secure-by-Design**: 
  - Local-custodial encrypted keystore (AES-256-GCM + Scrypt).
  - Private keys never leave your machine and are never logged.
- **📈 Portfolio Intelligence**: Real-time SOL and SPL token tracking with clear, modern TUI tables.
- **🔒 Guardrailed Transactions**: Every state-changing operation undergoes simulation and requires explicit user confirmation.
- **⌨️ Modern TUI**: Rich, interactive terminal experience with smooth spinners, gradients, and keyboard-first navigation.

## 📦 Packages

This project is a monorepo managed with **pnpm workspaces**.

| Package | Path | Description |
| :--- | :--- | :--- |
| **`kiro-agent`** | [`apps/cli`](./apps/cli) | The primary CLI application (AI orchestrator + TUI). |
| **`web`** | [`apps/web`](./apps/web) | Next.js landing site and dashboard. |
| **`shared`** | `packages/shared` | Common TypeScript types, tool schemas, and constants. |
| **`brand`** | `packages/brand` | Shared brand tokens, copy, and design assets. |

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- A Solana RPC endpoint (Devnet recommended for testing)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AshutoshDM1/Web3-Frontier.git
   cd Web3-Frontier
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Navigate to `apps/cli` and create a `.env` file:
   ```bash
   cd apps/cli
   cp .env.example .env
   # Add your GEMINI_API_KEY and RPC_URL
   ```

4. **Build the project:**
   ```bash
   pnpm build
   ```

5. **Run Kiro:**
   ```bash
   pnpm --filter kiro-agent start
   # or link the binary
   npm link ./apps/cli
   kiro
   ```

## ⌨️ Usage Examples

- **Balance Check**: `"How much SOL do I have?"`
- **Portfolio Overview**: `"Show my portfolio"`
- **Token Transfer**: `"Send 0.5 SOL to 4k3Dyj... and confirm with me"`
- **Wallet Management**: `"Create a new wallet for my trading bots"`

## 🛡️ Security Principles

- **No Secret Logging**: Kiro is hardcoded to never print or log secret keys, mnemonics, or passphrases.
- **Simulation First**: Transactions are simulated against the network before you are asked to sign.
- **Memory Only**: Decrypted key material exists only in volatile memory during signing operations.

## 🗺️ Roadmap

- [x] **M1**: Scaffold pnpm workspace + CLI skeleton
- [ ] **M2**: Encrypted keystore + Wallet management
- [ ] **M3**: Rich Portfolio TUI (SOL + SPL)
- [ ] **M4**: Gemini Tool-Calling Integration
- [ ] **M5**: Guardrailed Transfers
- [ ] **M6**: Next.js Landing Page
- [ ] **M7**: Jupiter Swap Integration

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with ❤️ for the Solana Community.
</div>
