import pc from "picocolors";
import { getBalance, getBalanceTool } from "./balance.js";
import { getWalletInfo, getWalletInfoTool } from "./wallet.js";

export const tools = [
  {
    functionDeclarations: [getBalanceTool, getWalletInfoTool]
  }
];

export const skillHandlers: Record<string, Function> = {
  get_balance: async (args: any) => {
    console.log(pc.dim(`\n  [Skill] Executing get_balance for ${args.address} on ${args.network}...`));
    return await getBalance(args.address, args.network);
  },
  get_wallet_info: async () => {
    return await getWalletInfo();
  }
};
