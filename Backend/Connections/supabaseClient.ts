import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Supabase URL or KEY missing in env. Ensure SUPABASE_URL and SUPABASE_KEY are set."
  );
  throw new Error("Supabase URL and SUPABASE_KEY are required.");
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
