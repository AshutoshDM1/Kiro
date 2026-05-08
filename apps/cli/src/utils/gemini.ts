import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { getConfig } from "./config.js";

dotenv.config();

export function getModel(systemInstruction?: string) {
  const { geminiApiKey, modelName } = getConfig();

  if (!geminiApiKey) {
    // If not found, we'll handle the prompt in agent.ts before calling this
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  
  return genAI.getGenerativeModel({
    model: modelName || "gemini-1.5-flash",
    systemInstruction: systemInstruction
  });
}
