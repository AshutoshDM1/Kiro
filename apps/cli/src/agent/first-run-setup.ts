import * as p from "@clack/prompts";
import pc from "picocolors";

import { getConfig, setConfig, type KiroConfig } from "../utils/config.js";

/** Shown in first-run copy; users can grab a key for trying Kiro without hunting Google AI Studio first. */
export const KIRO_KEYS_INFO_URL = "https://kiro.elitedev.space/";

const GEMINI_MODEL_OPTIONS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (fast)" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
] as const;

const VERCEL_GATEWAY_MODEL_OPTIONS = [
  { value: "openai/gpt-4o", label: "OpenAI GPT-4o" },
  { value: "openai/gpt-4o-mini", label: "OpenAI GPT-4o mini" },
  {
    value: "anthropic/claude-sonnet-4.5",
    label: "Anthropic Claude Sonnet 4.5",
  },
] as const;

function isNonEmptyGatewayKey(value: string | undefined): string | undefined {
  if (value === undefined) return "Required";
  const t = value.trim();
  if (t.length < 8) return "Key is too short";
  return undefined;
}

/**
 * One-time wizard: provider → model → credentials. Persists to Conf-backed config.
 * @returns false if the user cancelled or aborted setup
 */
export async function runFirstRunWizardIfNeeded(): Promise<boolean> {
  if (getConfig().isConfigured) return true;

  p.log.info(
    pc.blue("Welcome to Kiro! Choose your AI provider (saved locally)."),
  );

  const agentType = await p.select<NonNullable<KiroConfig["agentType"]>>({
    message: "Which AI backend should Kiro use?",
    options: [
      {
        value: "gemini",
        label: "Gemini (Google Generative AI SDK + native tools)",
      },
      {
        value: "vercel-ai",
        label: "Vercel AI SDK (AI Gateway — string model IDs + AI SDK tools)",
      },
    ],
  });
  if (p.isCancel(agentType)) return false;

  if (agentType === "gemini") {
    const modelName = await p.select<string>({
      message: "Pick a Gemini model",
      options: [...GEMINI_MODEL_OPTIONS],
    });
    if (p.isCancel(modelName)) return false;

    p.note(
      `Need a key to try Kiro? Get one for testing on the Kiro site:\n${KIRO_KEYS_INFO_URL}\n\nYou can also use a key from Google AI Studio (Gemini API).`,
      "Gemini API key",
    );

    const geminiApiKey = await p.password({
      message: "Paste your Gemini API key",
      validate: (value) => {
        if (!value || value.trim().length < 10) return "Enter a valid API key";
      },
    });
    if (p.isCancel(geminiApiKey)) return false;

    setConfig({
      agentType: "gemini",
      modelName,
      geminiApiKey: geminiApiKey as string,
      isConfigured: true,
    });
    p.log.success("Saved: Gemini + your API key.");
    return true;
  }

  const vercelModelName = await p.select<string>({
    message: "Pick a model (routed via Vercel AI Gateway)",
    options: [...VERCEL_GATEWAY_MODEL_OPTIONS],
  });
  if (p.isCancel(vercelModelName)) return false;

  const vercelApiKey = await p.password({
    message:
      "Vercel AI Gateway API key (Dashboard → AI → API keys; often starts with vck_)",
    validate: isNonEmptyGatewayKey,
  });
  if (p.isCancel(vercelApiKey)) return false;

  setConfig({
    agentType: "vercel-ai",
    vercelModelName,
    vercelApiKey: vercelApiKey as string,
    isConfigured: true,
  });
  p.log.success("Saved: Vercel AI Gateway + model.");
  return true;
}
