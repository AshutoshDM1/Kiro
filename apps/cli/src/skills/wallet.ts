import pc from "picocolors";
import { getLinkedWallet } from "../utils/wallet.js";

export const getWalletInfoTool = {
  name: "get_wallet_info",
  description: "Get the linked Solana wallet information (public key and path).",
  parameters: {
    type: "OBJECT",
    properties: {}
  }
};

export async function getWalletInfo() {
  console.log(pc.dim(`\n  [Skill] Executing get_wallet_info...`));
  const wallet = await getLinkedWallet();
  if (wallet) {
    return {
      publicKey: wallet.publicKey,
      path: wallet.path
    };
  }
  return { error: "No wallet linked" };
}
