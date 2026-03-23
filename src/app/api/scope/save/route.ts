import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase";
import { extractTitle } from "@/lib/prompt";
import type { ScopeInput } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { input, output }: { input: ScopeInput; output: string } =
    await req.json();

  if (!output?.trim()) {
    return new Response("Output is required", { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("scopes")
    .insert({
      user_id: userId,
      input,
      output,
      title: extractTitle(input.description),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save scope:", error);
    return new Response("Failed to save scope", { status: 500 });
  }

  return Response.json({ id: data.id });
}
