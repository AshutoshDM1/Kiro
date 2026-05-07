import type { Network } from "./network.js";
import { rpcFromNetwork } from "./network.js";
import { loadSolanaCliConfig } from "../solanaCliKeypair.js";

export async function resolveRpcUrl(params: {
  network: Network;
  rpcOverride?: string;
}): Promise<{ rpc: string; configPath: string }> {
  const { config, configPath } = await loadSolanaCliConfig();
  const rpc =
    params.rpcOverride ??
    process.env.SOLANA_RPC_URL ??
    config.json_rpc_url ??
    rpcFromNetwork(params.network);

  return { rpc, configPath };
}

