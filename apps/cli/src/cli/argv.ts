// pnpm sometimes forwards an extra literal "--" into argv for scripts.
// Commander treats it as a command token, so we remove the first standalone "--".
export function normalizeArgv(argv: string[]): string[] {
  const next = [...argv];
  const idx = next.indexOf("--");
  if (idx !== -1) next.splice(idx, 1);
  return next;
}

