import { createServerClient } from "./supabase";

export const FREE_SCOPE_LIMIT = 2;

export async function getScopeCount(userId: string): Promise<number> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("scopes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) return 0;
  return count ?? 0;
}

export async function canGenerateScope(
  userId: string,
  isPro: boolean
): Promise<{ allowed: boolean; count: number }> {
  if (isPro) return { allowed: true, count: 0 };
  const count = await getScopeCount(userId);
  return { allowed: count < FREE_SCOPE_LIMIT, count };
}
