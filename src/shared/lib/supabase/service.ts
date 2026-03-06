// lib/supabase/service.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

/**
 * Service role client for server-side operations that bypass RLS.
 *
 * WARNING: This client has FULL database access and bypasses Row Level Security.
 * Only use for:
 * - Admin operations (creating users, managing invitations)
 * - Background jobs
 * - Server-side operations that need elevated permissions
 *
 * DO NOT expose this client to the browser or use it based on user input
 * without proper authorization checks.
 */
export function createClient() {
  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error("Missing SUPABASE_SECRET_KEY environment variable");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

/**
 * Alternative: Async version if you need to match the signature of your server client
 */
export function createServiceClient() {
  return createClient();
}
