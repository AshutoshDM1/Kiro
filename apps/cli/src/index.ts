import { normalizeArgv } from "./cli/argv.js";
import { createProgram } from "./cli/program.js";
import { registerBalanceCommand } from "./commands/balance.js";
import { runInteractiveOnboarding } from "./ui/onboarding.js";

const program = createProgram();
registerBalanceCommand(program);

const argv = normalizeArgv(process.argv);

(async () => {
  const args = argv.slice(2);
  if (args.length === 0) {
    await runInteractiveOnboarding();
    return;
  }
  await program.parseAsync(argv);
})().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exitCode = 1;
});

