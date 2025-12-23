import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient();
    }
    const value = supabaseInstance[prop as keyof SupabaseClient];
    if (typeof value === "function") {
      return value.bind(supabaseInstance);
    }
    return value;
  },
});
