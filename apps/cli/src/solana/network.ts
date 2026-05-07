export type Network = "devnet" | "mainnet";

export function normalizeNetwork(value: string | undefined): Network {
  return value === "mainnet" ? "mainnet" : "devnet";
}

export function rpcFromNetwork(network: Network): string {
  return network === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com";
}

