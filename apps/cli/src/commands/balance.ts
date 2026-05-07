import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import type { Command } from "commander";
import { loadSolanaCliKeypair } from "../solanaCliKeypair.js";
import type { GlobalOptions } from "../cli/program.js";
import { resolveRpcUrl } from "../solana/resolveRpc.js";

export function registerBalanceCommand(program: Command): void {
  program
    .command("balance")
    .description("Print SOL balance (from --address or the configured keypair)")
    .action(async () => {
      const opts = program.opts<{
        network: string;
        rpc?: string;
        keypair?: string;
        address?: string;
      }>() as unknown as GlobalOptions;

      const { rpc, configPath } = await resolveRpcUrl({
        network: opts.network,
        rpcOverride: opts.rpc,
      });

      const connection = new Connection(rpc, "confirmed");

      let pubkey: PublicKey;
      let signerLabel: string;

      if (opts.address) {
        pubkey = new PublicKey(opts.address);
        signerLabel = "Watch-only address";
      } else {
        const { keypair, keypairPath } = await loadSolanaCliKeypair({
          keypairPath: opts.keypair,
        });
        pubkey = keypair.publicKey;
        signerLabel = `Keypair: ${keypairPath}`;
      }

      const lamports = await connection.getBalance(pubkey);
      const sol = lamports / LAMPORTS_PER_SOL;

      process.stdout.write(
        [
          `Network: ${opts.network}`,
          `RPC: ${rpc}`,
          `SolanaConfig: ${configPath}`,
          `Address: ${pubkey.toBase58()}`,
          signerLabel,
          `Balance: ${sol} SOL`,
        ].join("\n") + "\n",
      );
    });
}

