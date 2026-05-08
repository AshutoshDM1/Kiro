import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { rpcFromNetwork } from "../utils/network.js";

export async function getBalance(address: string, network: "devnet" | "mainnet-beta" = "devnet") {
  try {
    const rpcUrl = network === "devnet" 
        ? "https://api.devnet.solana.com" 
        : "https://api.mainnet-beta.solana.com";
        
    const connection = new Connection(rpcUrl, "confirmed");
    const pubkey = new PublicKey(address);
    const lamports = await connection.getBalance(pubkey);
    const sol = lamports / LAMPORTS_PER_SOL;
    
    return {
        address,
        balance: sol,
        unit: "SOL",
        network
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getBalanceTool = {
  name: "get_balance",
  description: "Get the SOL balance of a Solana wallet address.",
  parameters: {
    type: "OBJECT",
    properties: {
      address: {
        type: "STRING",
        description: "The Solana wallet address (public key)."
      },
      network: {
        type: "STRING",
        description: "The Solana network to use (devnet or mainnet-beta).",
        enum: ["devnet", "mainnet-beta"]
      }
    },
    required: ["address"]
  }
};
