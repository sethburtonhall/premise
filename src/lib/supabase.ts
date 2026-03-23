import { createClient } from "@supabase/supabase-js";

// SQL to run in Supabase dashboard:
// CREATE TABLE scopes (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id text NOT NULL,
//   input jsonb NOT NULL,
//   output text NOT NULL,
//   title text,
//   created_at timestamptz DEFAULT now()
// );
// CREATE INDEX scopes_user_id_idx ON scopes(user_id);
// ALTER TABLE scopes ENABLE ROW LEVEL SECURITY;

export type Scope = {
  id: string;
  user_id: string;
  input: ScopeInput;
  output: string;
  title: string | null;
  created_at: string;
};

export type ScopeInput = {
  description: string;
  budget: string;
  timeline: string;
  platform: string;
  teamContext: string;
};

// Server-side client using service role (bypasses RLS)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Client-side client using anon key
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
