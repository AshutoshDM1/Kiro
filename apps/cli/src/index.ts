import { runAgent } from "./agent.js";
import { clearConfig } from "./utils/config.js";
import pc from "picocolors";

function wantsConfigClear(argv: string[]): boolean {
  if (argv.includes("--reset")) return true;
  const i = argv.indexOf("config");
  return i !== -1 && argv[i + 1] === "clear";
}

function wantsLegacyReset(argv: string[]): boolean {
  return argv[0] === "reset";
}

(async () => {
  const argv = process.argv.slice(2);

  if (wantsLegacyReset(argv) || wantsConfigClear(argv)) {
    clearConfig();
    console.log(pc.green("✔") + " Saved CLI configuration cleared.\n");
    process.exit(0);
  }

  await runAgent();
})().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exitCode = 1;
});
