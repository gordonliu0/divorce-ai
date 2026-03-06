import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Json } from "@/database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export function processJsonSafely(
  json: Json
): Record<string, unknown> | undefined {
  // Handle null
  if (json === null) {
    return undefined;
  }

  // Handle primitives
  if (typeof json !== "object") {
    return undefined;
  }

  // Handle arrays
  if (Array.isArray(json)) {
    return undefined;
  }

  // Now we know it's an object, but let's be extra safe
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(json)) {
    // Filter out undefined values if needed
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
