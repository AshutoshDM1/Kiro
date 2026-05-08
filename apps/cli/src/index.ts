import { runAgent } from "./agent.js";

(async () => {
  await runAgent();
})().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exitCode = 1;
});
