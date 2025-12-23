import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");
}

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export function createSupabaseClient(accessToken?: string): SupabaseClient {
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function verifySupabaseToken(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCoachById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("coaches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching coach:", error);
    return null;
  }

  return data;
}

export async function getMemberById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*, coaches(brand_slug, display_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching member:", error);
    return null;
  }

  return data;
}

export async function getCoachByBrandSlug(brandSlug: string) {
  const { data, error } = await supabaseAdmin
    .from("coaches")
    .select("*")
    .eq("brand_slug", brandSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching coach by brand slug:", error);
    return null;
  }

  return data;
}

export async function getCoachByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("coaches")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Error fetching coach by email:", error);
    return null;
  }

  return data;
}

export async function getMemberByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*, coaches(brand_slug, display_name)")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Error fetching member by email:", error);
    return null;
  }

  return data;
}

export { supabaseAdmin as supabase };
export default supabaseAdmin;
