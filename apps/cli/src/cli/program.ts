import { Command } from "commander";

import type { Network } from "../solana/network.js";
import { normalizeNetwork } from "../solana/network.js";

export type GlobalOptions = {
  network: Network;
  rpc?: string;
  keypair?: string;
  address?: string;
};

export function createProgram(): Command {
  const program = new Command()
    .name("kiro")
    .description("Web3-Frontier: AI-powered Solana terminal CLI")
    .option(
      "--network <network>",
      "Solana cluster: devnet|mainnet (default: devnet)",
      normalizeNetwork(process.env.SOLANA_NETWORK),
    )
    .option(
      "--rpc <url>",
      "Solana RPC URL (overrides --network and Solana CLI config)",
      process.env.SOLANA_RPC_URL,
    )
    .option(
      "--keypair <path>",
      "Path to Solana keypair JSON (overrides Solana CLI config and SOLANA_KEYPAIR)",
    )
    .option(
      "--address <pubkey>",
      "Watch-only: fetch balance for a public key (no keypair needed)",
    );

  return program;
}

export function getGlobalOptions(program: Command): GlobalOptions {
  const opts = program.opts<{
    network: string;
    rpc?: string;
    keypair?: string;
    address?: string;
  }>();

  return {
    network: normalizeNetwork(opts.network),
    rpc: opts.rpc,
    keypair: opts.keypair,
    address: opts.address,
  };
}

