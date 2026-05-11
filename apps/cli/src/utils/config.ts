import Conf from "conf";

export type KiroConfig = {
  isConfigured?: boolean;
  agentType?: "gemini" | "vercel-ai";
  geminiApiKey?: string;
  modelName?: string;
  vercelApiKey?: string;
  vercelModelName?: string;
};

const config = new Conf<KiroConfig>({
  projectName: "kiro-cli",
});

export function getConfig() {
  const savedKey = config.get("geminiApiKey");

  return {
    isConfigured: config.get("isConfigured") || false,
    agentType: config.get("agentType") || "gemini",
    geminiApiKey: savedKey || process.env.GEMINI_API_KEY,
    modelName: config.get("modelName") || "gemini-2.5-flash",
    vercelApiKey:
      config.get("vercelApiKey") ||
      process.env.VERCEL_AI_KEY ||
      process.env.AI_GATEWAY_API_KEY,
    vercelModelName: config.get("vercelModelName") || "openai/gpt-4o",
  };
}

export function setConfig(updates: Partial<KiroConfig>) {
  if (updates.isConfigured !== undefined)
    config.set("isConfigured", updates.isConfigured);
  if (updates.agentType !== undefined)
    config.set("agentType", updates.agentType);
  if (updates.geminiApiKey !== undefined)
    config.set("geminiApiKey", updates.geminiApiKey);
  if (updates.modelName !== undefined)
    config.set("modelName", updates.modelName);
  if (updates.vercelApiKey !== undefined)
    config.set("vercelApiKey", updates.vercelApiKey);
  if (updates.vercelModelName !== undefined)
    config.set("vercelModelName", updates.vercelModelName);
}

export function clearConfig() {
  config.clear();
}
