import { tool, type ToolSet } from "ai";
import { z } from "zod";
import { tools, skillHandlers } from "../skills/index.js";

// Build a proper Zod field from a Gemini property schema
function buildZodField(prop: any): z.ZodTypeAny {
  const type = prop?.type?.toLowerCase();

  switch (type) {
    case 'integer':
    case 'number': {
      let field: z.ZodTypeAny = z.number();
      if (prop.description) field = (field as z.ZodNumber).describe(prop.description);
      return field;
    }
    case 'boolean': {
      let field: z.ZodTypeAny = z.boolean();
      if (prop.description) field = (field as z.ZodBoolean).describe(prop.description);
      return field;
    }
    case 'string':
    default: {
      // Handle enum strings
      if (prop.enum && prop.enum.length > 0) {
        const enumField = z.enum(prop.enum as [string, ...string[]]);
        return prop.description ? enumField.describe(prop.description) : enumField;
      }
      let field: z.ZodTypeAny = z.string();
      if (prop.description) field = (field as z.ZodString).describe(prop.description);
      return field;
    }
  }
}

// Build a Zod object schema from a Gemini-format parameters object
function buildZodSchema(geminiSchema: any): z.ZodObject<any> {
  const properties = geminiSchema?.properties || {};
  const required: string[] = geminiSchema?.required || [];
  const requiredSet = new Set(required);

  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, prop] of Object.entries<any>(properties)) {
    const zodField = buildZodField(prop);
    shape[key] = requiredSet.has(key) ? zodField : zodField.optional();
  }

  return z.object(shape);
}

export function getVercelTools(): ToolSet {
  const vercelTools: ToolSet = {};

  const functionDeclarations = tools.flatMap((t: any) => t.functionDeclarations || []);

  for (const decl of functionDeclarations) {
    const zodSchema = buildZodSchema(decl.parameters);

    vercelTools[decl.name] = tool({
      description: decl.description,
      inputSchema: zodSchema,
      execute: async (input) => {
        const handler = skillHandlers[decl.name];
        if (handler) {
          return await handler(input);
        }
        return { error: "Function not found" };
      },
    });
  }

  return vercelTools;
}
