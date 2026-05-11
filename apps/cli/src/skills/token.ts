import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import pc from "picocolors";
import { getLinkedWallet } from "../utils/wallet.js";

export async function createToken(args: { name: string, symbol: string, uri: string, decimals?: number, network?: "devnet" | "mainnet-beta" }) {
  const { name, symbol, uri, decimals = 9, network = "devnet" } = args;

  try {
    const wallet = await getLinkedWallet();
    if (!wallet || !wallet.keypair) {
      return { error: "No wallet linked. Please link a wallet first." };
    }

    const rpcUrl = network === "devnet" 
        ? "https://api.devnet.solana.com" 
        : "https://api.mainnet-beta.solana.com";

    const umi = createUmi(rpcUrl);
    const umiKeypair = fromWeb3JsKeypair(wallet.keypair);
    umi.use(keypairIdentity(umiKeypair));

    const mint = generateSigner(umi);

    console.log(pc.dim(`\n  [Skill] Creating token ${name} (${symbol}) on ${network}...`));
    
    const tx = await createV1(umi, {
      mint,
      authority: umi.identity,
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
    
    return {
      success: true,
      network,
      mintAddress: mint.publicKey.toString(),
      name,
      symbol,
      decimals
    };
  } catch (error: any) {
    console.error(pc.red(`  [Error] Failed to create token: ${error.message}`));
    return { error: error.message };
  }
}

export const createTokenTool = {
  name: "create_token",
  description: "Create a custom SPL token on Solana with metadata (name, symbol, uri, decimals).",
  parameters: {
    type: "OBJECT",
    properties: {
      name: {
        type: "STRING",
        description: "The name of the token (e.g., 'Kiro Token')."
      },
      symbol: {
        type: "STRING",
        description: "The symbol of the token (e.g., 'KRO')."
      },
      uri: {
        type: "STRING",
        description: "The URI pointing to the token's JSON metadata. (e.g. 'https://example.com/metadata.json')"
      },
      decimals: {
        type: "INTEGER",
        description: "The number of decimals for the token. Default is usually 9."
      },
      network: {
        type: "STRING",
        description: "The Solana network to use (devnet or mainnet-beta).",
        enum: ["devnet", "mainnet-beta"]
      }
    },
    required: ["name", "symbol", "uri"]
  }
};
