import { tryLoadSolanaCliKeypair, loadSolanaCliConfig } from "./solanaCliKeypair.js";

export async function getLinkedWallet() {
  const result = await tryLoadSolanaCliKeypair();
  if (result.ok) {
    return {
      publicKey: result.keypair.publicKey.toBase58(),
      keypair: result.keypair,
      path: result.keypairPath
    };
  }
  return null;
}

export async function getSolanaConfig() {
    return await loadSolanaCliConfig();
}
