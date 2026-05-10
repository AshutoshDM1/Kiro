<div align="center">
  <h1>Kiro Agent CLI</h1>
  <p>The AI-powered engine behind the Solana Frontier.</p>
</div>

---

## 🛠️ Internal Skills (Packages)

Kiro is built on a modular "Skill" architecture. Each skill provides a set of tools that the AI agent can utilize.

| Skill | Description | Tools |
| :--- | :--- | :--- |
| **`Wallet`** | Manages local-custodial keys. | `wallet_create`, `wallet_import`, `wallet_list` |
| **`Balance`** | Fetches real-time SOL/SPL data. | `balance_get`, `portfolio_get` |
| **`Transaction`** | (Planned) Handles safe transfers. | `send_sol`, `token_transfer` |

## 🚀 Development

### Build
```bash
pnpm build
```

### Dev Mode
```bash
pnpm dev
```

### CLI Options
- `--plain`: Disable rich TUI for minimal terminal output.
- `--help`: Show available commands.

## 🤖 AI Model
Currently using **Gemini 2.0 Flash** for fast, reliable tool orchestration.
