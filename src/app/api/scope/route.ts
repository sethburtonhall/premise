import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@clerk/nextjs/server";
import { canGenerateScope } from "@/lib/usage";
import { SCOPE_SYSTEM_PROMPT, buildScopePrompt } from "@/lib/prompt";
import type { ScopeInput } from "@/lib/supabase";
import type { SessionClaims } from "@/types/auth";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId, has, sessionClaims } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isPro =
    has({ plan: "pro" }) ||
    (sessionClaims as SessionClaims)?.metadata?.special_access === true;

  const { allowed, count } = await canGenerateScope(userId, isPro);
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "upgrade_required",
        message: `You've used your ${count} free scope${count !== 1 ? "s" : ""}. Upgrade to Pro for unlimited scoping.`,
      }),
      { status: 402, headers: { "Content-Type": "application/json" } },
    );
  }

  const body: ScopeInput = await req.json();

  if (!body.description?.trim()) {
    return new Response("Project description is required", { status: 400 });
  }

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SCOPE_SYSTEM_PROMPT,
    prompt: buildScopePrompt(body),
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
