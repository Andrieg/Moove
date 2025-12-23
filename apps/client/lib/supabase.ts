import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function readSupabaseEnv() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    // fallback for Bolt/Vite-style envs
    (process.env as any).VITE_SUPABASE_URL?.trim();

  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    // fallback for Bolt/Vite-style envs
    (process.env as any).VITE_SUPABASE_ANON_KEY?.trim();

  return { url, anon };
}

function createSupabaseClient(): SupabaseClient {
  const { url, anon } = readSupabaseEnv();

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY), then restart the dev server."
    );
  }

  return createClient(url, anon);
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!supabaseInstance) supabaseInstance = createSupabaseClient();
    const value = supabaseInstance[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(supabaseInstance) : value;
  },
});
