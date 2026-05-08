import Conf from "conf";

export type KiroConfig = {
  geminiApiKey?: string;
  modelName?: string;
  useSharedKey?: boolean;
};

// This is the "shared" key provided by the developer
export const SHARED_API_KEY = "AIzaSyBO9TAcHUAUunnpKdu0aoiIQJ2HkHaL27g";

const config = new Conf<KiroConfig>({
  projectName: "kiro-cli",
});

export function getConfig() {
  const savedKey = config.get("geminiApiKey");
  const useShared = config.get("useSharedKey");

  return {
    geminiApiKey: useShared ? SHARED_API_KEY : (savedKey || process.env.GEMINI_API_KEY),
    modelName: config.get("modelName") || "gemini-3.1-flash-lite",
    isShared: !!useShared
  };
}

export function setConfig(updates: Partial<KiroConfig>) {
  if (updates.geminiApiKey !== undefined) config.set("geminiApiKey", updates.geminiApiKey);
  if (updates.modelName !== undefined) config.set("modelName", updates.modelName);
  if (updates.useSharedKey !== undefined) config.set("useSharedKey", updates.useSharedKey);
}

export function clearConfig() {
  config.clear();
}
