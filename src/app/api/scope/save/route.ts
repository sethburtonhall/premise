import { auth, clerkClient } from "@clerk/nextjs/server";
import { sendEvent, updateContact } from "@/lib/loops";
import { createServerClient } from "@/lib/supabase";
import { extractTitle } from "@/lib/prompt";
import { canGenerateScope, getScopeCount, FREE_SCOPE_LIMIT } from "@/lib/usage";
import type { ScopeInput } from "@/lib/supabase";
import type { SessionClaims } from "@/types/auth";

export async function POST(req: Request) {
  const { userId, has, sessionClaims } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isPro =
    has({ plan: "pro" }) ||
    (sessionClaims as SessionClaims)?.metadata?.special_access === true;

  let allowed: boolean;
  try {
    ({ allowed } = await canGenerateScope(userId, isPro));
  } catch (err) {
    console.error("Usage check failed during save:", err);
    return new Response("Service temporarily unavailable", { status: 503 });
  }

  if (!allowed) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId,
      )?.emailAddress;
      if (email) await sendEvent(email, "freeLimitReached");
    } catch (err) {
      console.error("Failed to fire freeLimitReached event:", err);
    }
    return new Response(JSON.stringify({ error: "upgrade_required" }), {
      status: 402,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();

  const { input, output } = body ?? {};

  if (typeof output !== "string" || !output.trim()) {
    return new Response("Output is required", { status: 400 });
  }

  if (output.length > 50000) {
    return new Response("Output is too long", { status: 400 });
  }

  const safeInput: ScopeInput = {
    description:
      typeof input?.description === "string"
        ? input.description.slice(0, 5000)
        : "",
    budget: typeof input?.budget === "string" ? input.budget.slice(0, 50) : "",
    timeline:
      typeof input?.timeline === "string" ? input.timeline.slice(0, 50) : "",
    platform:
      typeof input?.platform === "string" ? input.platform.slice(0, 50) : "",
    teamContext:
      typeof input?.teamContext === "string"
        ? input.teamContext.slice(0, 50)
        : "",
  };

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("scopes")
    .insert({
      user_id: userId,
      input: safeInput,
      output,
      title: extractTitle(safeInput.description),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save scope:", error);
    return new Response("Failed to save scope", { status: 500 });
  }

  updateContact({
    userId,
    hasGeneratedScope: true,
    userGroup: isPro ? "pro" : "free",
  }).catch((err) => console.error("Failed to update hasGeneratedScope:", err));

  // Check if user just reached their free limit (went from 1 to 2 scopes)
  if (!isPro) {
    try {
      const count = await getScopeCount(userId);
      if (count === FREE_SCOPE_LIMIT) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const email = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId,
        )?.emailAddress;
        if (email) await sendEvent(email, "freeLimitReached");
      }
    } catch (err) {
      console.error(
        "Failed to check limit or fire freeLimitReached event:",
        err,
      );
    }
  }

  return Response.json({ id: data.id });
}
