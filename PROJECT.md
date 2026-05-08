# Kiro — AI Solana Terminal (Project Spec)

## Vision

Kiro is a **terminal-first Solana assistant**: users type natural language like “show my portfolio”, “send 0.1 SOL to …”, or “create a wallet”, and an integrated AI agent executes **safe, deterministic tools** to perform Web3 actions.

The CLI must feel modern: rich UI in terminal, accessible, keyboard-first, and scriptable when needed.

## Target users

- Solana power users who prefer terminal workflows
- Developers who want a programmable wallet/portfolio CLI
- New users who want plain-English help, but with clear confirmations and safety rails

## Non-goals (v1)

- EVM support (Solana-only for v1)
- Browser wallet integrations (we will use a local-custodial encrypted keystore first)
- Complex DeFi strategies (start with portfolio + transfers; swaps later)

## Core use cases (v1)

### Wallet

- Create a new wallet (Solana Keypair)
- Import an existing wallet using secret key input
- Set an “active wallet” profile
- Show public address + basic wallet info

### Read-only portfolio

- Ask: “What’s my SOL balance?”
- Ask: “Show my portfolio”
  - SOL balance
  - SPL token balances from token accounts
  - Optional: token symbols/decimals via token list
  - Optional: prices later (keep read-only and robust first)

### Transactions (guardrailed)

- Send SOL or SPL tokens with a **two-step flow**:
  1) Build + simulate + present summary (recipient, amount, fees)
  2) Require explicit confirmation, then sign + send

## Wallet model (local-custodial)

This project will use **local-custodial wallets**:

- Private keys stored only in an **encrypted keystore file** on disk.
- Encryption approach:
  - KDF: **scrypt**
  - Encryption: **AES-256-GCM**
- The user unlocks signing with a passphrase; decrypted key material exists **only in memory**.
- The agent must **never print or log** secret keys, mnemonics, or passphrases.

## AI design (agentic tool execution)

The AI is not “magic”; it is a router that converts user intent into **tool calls**.

### Principles

- AI never gets direct access to private keys.
- Tools are deterministic and validated (input schema validation).
- Any state-changing operation requires:
  - simulation, and
  - explicit user confirmation
- Tool calls are rate-limited to avoid loops.

### Initial tool surface (v1)

Read-only:

- `balance_get(address?)`
- `portfolio_get(address?)`

Wallet:

- `wallet_create(label?)`
- `wallet_import(secretKey, label?)`
- `wallet_list()`
- `wallet_set_active(label)`

Transactions:

- `send_sol(to, amountSol)`
- `token_transfer(mint, to, amountUi)`

Optional later:

- `swap(fromMint, toMint, amount, slippageBps)` (Jupiter)

## Terminal UX requirements (rich + accessible)

- Default: rich interactive TUI for AI chat, portfolio tables, confirmations
- Must support:
  - `--plain` mode (minimal ANSI/spinners; good for logs and screen readers)
  - `NO_COLOR`
  - keyboard-only navigation
- Do not rely on color alone for meaning (use icons/text labels and clear copy)

## Tech stack (locked)

- **Monorepo**: **pnpm workspace**
- **Runtime**: Node.js (target Node 20+)
- **Language**: TypeScript (strict)
- **Solana**: `@solana/web3.js`
- **CLI framework**: `commander` (or equivalent)
- **TUI**: Ink (React in terminal) for a modern experience
- **Schema validation**: `zod` for tool inputs/outputs
- **AI SDK**: a tool-calling capable client (provider choice later)

## Proposed repo layout (to be created after this spec)

- `apps/cli` — the terminal app (commands + TUI + AI orchestrator)
- `apps/web` — landing site (Next.js)
- `packages/shared` — shared TypeScript types (tool schemas, constants)
- `packages/brand` — shared brand tokens (copy/colors later)

## Security principles

- Never log secrets (keys, passphrases, raw keystore contents).
- Simulate before sending transactions.
- Require explicit confirmation before signing/sending.
- Keep tool permissions minimal (no “arbitrary RPC” tool in v1).
- Default to safe network settings; avoid surprising mainnet actions.

## Milestones

- **M0**: `PROJECT.MD` + Cursor rules (this commit of work)
- **M1**: Scaffold pnpm workspace + `apps/cli` skeleton
- **M2**: Wallet create/import + encrypted keystore + `balance`
- **M3**: Portfolio (SOL + SPL) with a clean TUI table
- **M4**: AI chat mode wired to read-only tools (`balance_get`, `portfolio_get`)
- **M5**: Transfers with simulate + confirm (SOL + SPL)
- **M6**: Landing page in `apps/web`
- **M7**: Jupiter swaps + optional pricing

## Open questions (decide before M1/M2)

- RPC provider: public RPC vs Helius/Triton/QuickNode
- AI provider/model: OpenAI vs Anthropic vs other (must support tool calling)
- Default network: devnet vs mainnet (recommend devnet default until stable)
- CLI name: `frontier` vs `web3-frontier` vs `wf`