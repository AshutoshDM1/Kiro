import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { Keypair } from "@solana/web3.js";

export type LoadKeypairOptions = {
  keypairPath?: string;
};

export type SolanaCliConfig = {
  json_rpc_url?: string;
  keypair_path?: string;
};

export function getDefaultSolanaCliKeypairPath(): string {
  // Solana CLI default keypair path across platforms
  // https://docs.solana.com/cli/configure-solana-cli
  return path.join(os.homedir(), ".config", "solana", "id.json");
}

export function getDefaultSolanaCliConfigPath(): string {
  return path.join(os.homedir(), ".config", "solana", "cli", "config.yml");
}

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

export async function loadSolanaCliConfig(
  configPath = process.env.SOLANA_CONFIG ?? getDefaultSolanaCliConfigPath(),
): Promise<{ config: SolanaCliConfig; configPath: string }> {
  let raw: string;
  try {
    raw = await fs.readFile(configPath, "utf8");
  } catch {
    return { config: {}, configPath };
  }

  // Solana CLI config.yml is simple YAML with `key: value` lines.
  // We parse only what we need and ignore the rest.
  const config: SolanaCliConfig = {};
  for (const line of raw.split(/\r?\n/g)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = stripQuotes(trimmed.slice(idx + 1).trim());
    if (key === "json_rpc_url") config.json_rpc_url = value;
    if (key === "keypair_path") config.keypair_path = value;
  }

  return { config, configPath };
}

export async function loadSolanaCliKeypair(
  options: LoadKeypairOptions = {},
): Promise<{ keypair: Keypair; keypairPath: string }> {
  const { config } = await loadSolanaCliConfig();
  const keypairPath =
    options.keypairPath ??
    process.env.SOLANA_KEYPAIR ??
    config.keypair_path ??
    getDefaultSolanaCliKeypairPath();

  let raw: string;
  try {
    raw = await fs.readFile(keypairPath, "utf8");
  } catch {
    throw new Error(
      [
        `Cannot read Solana keypair file at "${keypairPath}".`,
        `Fix by either:`,
        `- running: solana config set --keypair <path-to-id.json>`,
        `- or passing: --keypair <path>`,
        `- or setting env: SOLANA_KEYPAIR=<path>`,
      ].join("\n"),
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `Invalid JSON in keypair file at "${keypairPath}". Expected a JSON array of numbers.`,
    );
  }

  if (!Array.isArray(parsed) || parsed.some((n) => typeof n !== "number")) {
    throw new Error(
      `Invalid keypair file at "${keypairPath}". Expected a JSON array of numbers (Solana CLI format).`,
    );
  }

  const secretKey = Uint8Array.from(parsed);
  const keypair = Keypair.fromSecretKey(secretKey);

  return { keypair, keypairPath };
}

export async function tryLoadSolanaCliKeypair(
  options: LoadKeypairOptions = {},
): Promise<
  | { ok: true; keypair: Keypair; keypairPath: string }
  | { ok: false; errorMessage: string; keypairPath: string }
> {
  const { config } = await loadSolanaCliConfig();
  const keypairPath =
    options.keypairPath ??
    process.env.SOLANA_KEYPAIR ??
    config.keypair_path ??
    getDefaultSolanaCliKeypairPath();

  try {
    const { keypair, keypairPath: resolved } = await loadSolanaCliKeypair({
      keypairPath,
    });
    return { ok: true, keypair, keypairPath: resolved };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { ok: false, errorMessage, keypairPath };
  }
}

