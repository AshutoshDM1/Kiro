export type Network = "devnet" | "mainnet-beta";

export function rpcFromNetwork(network: Network): string {
  return network === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com";
}
