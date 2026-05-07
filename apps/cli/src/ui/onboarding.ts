import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { confirm, select } from "@inquirer/prompts";

import { rpcFromNetwork } from "../solana/network.js";
import { loadSolanaCliConfig, tryLoadSolanaCliKeypair } from "../solanaCliKeypair.js";

export async function runInteractiveOnboarding(): Promise<void> {
  process.stdout.write(
    [
      "Welcome to Web3-Frontier (Solana Terminal CLI).",
      "We’ll connect to devnet by default and can read your Solana CLI config.",
      "",
    ].join("\n") + "\n",
  );

  const wantsSignup = await confirm({
    message: "Do you want to sign up (set up a wallet profile) now?",
    default: true,
  });

  if (!wantsSignup) {
    process.stdout.write(
      "No problem. You can run `kiro balance --address <PUBKEY>` any time.\n",
    );
    return;
  }

  const signupMethod = await select<"solana_cli_config" | "watch_only">({
    message: "Choose a signup method",
    choices: [
      { name: "Use Solana CLI config (recommended)", value: "solana_cli_config" },
      { name: "Watch-only (public address only)", value: "watch_only" },
    ],
  });

  if (signupMethod === "watch_only") {
    process.stdout.write(
      ["", "Watch-only mode enabled.", "Use: kiro balance --address <PUBKEY>", ""].join("\n") +
        "\n",
    );
    return;
  }

  const { configPath } = await loadSolanaCliConfig();
  const result = await tryLoadSolanaCliKeypair();

  if (!result.ok) {
    process.stdout.write(
      [
        "",
        "We could not load your Solana CLI keypair.",
        `SolanaConfig: ${configPath}`,
        "",
        result.errorMessage,
        "",
        "Once configured, re-run `kiro` to continue.",
        "",
      ].join("\n") + "\n",
    );
    return;
  }

  process.stdout.write(
    [
      "",
      "Success! Solana CLI wallet loaded.",
      `SolanaConfig: ${configPath}`,
      `Address: ${result.keypair.publicKey.toBase58()}`,
      `Keypair: ${result.keypairPath}`,
      "",
    ].join("\n") + "\n",
  );

  const wantsBalance = await confirm({
    message: "Do you want to fetch your DEVNET SOL balance now?",
    default: true,
  });

  if (!wantsBalance) return;

  const connection = new Connection(rpcFromNetwork("devnet"), "confirmed");
  const lamports = await connection.getBalance(result.keypair.publicKey);
  const sol = lamports / LAMPORTS_PER_SOL;

  process.stdout.write(`Devnet balance: ${sol} SOL\n`);
}

