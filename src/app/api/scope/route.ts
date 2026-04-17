import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@clerk/nextjs/server";
import { canGenerateScope } from "@/lib/usage";
import { SCOPE_SYSTEM_PROMPT, buildScopePrompt } from "@/lib/prompt";
import type { ScopeInput } from "@/types/scope";
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

  let allowed: boolean;
  let count: number;
  try {
    ({ allowed, count } = await canGenerateScope(userId, isPro));
  } catch (err) {
    console.error("Usage check failed:", err);
    return new Response("Service temporarily unavailable", { status: 503 });
  }

  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "upgrade_required",
        message: `You've used your ${count} free scope${count !== 1 ? "s" : ""}. Upgrade to Pro for unlimited scoping.`,
      }),
      { status: 402, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();

  if (typeof body !== "object" || body === null) {
    return new Response("Invalid request body", { status: 400 });
  }

  const { description, budget, timeline, platform, teamContext } = body;

  if (typeof description !== "string" || !description.trim()) {
    return new Response("Project description is required", { status: 400 });
  }

  if (description.trim().length > 5000) {
    return new Response("Project description is too long", { status: 400 });
  }

  const VALID_BUDGETS = [
    "under-10k",
    "10k-50k",
    "50k-100k",
    "100k-plus",
    "unknown",
  ];
  const VALID_TIMELINES = [
    "asap",
    "1-2-months",
    "3-6-months",
    "6-plus-months",
    "unknown",
  ];
  const VALID_PLATFORMS = [
    "web-app",
    "marketing-site",
    "mobile-app",
    "ecommerce",
    "api-backend",
    "other",
    "unknown",
  ];
  const VALID_CONTEXTS = [
    "agency-pitching",
    "agency-kicking-off",
    "founder-building",
    "internal-team",
  ];

  if (!VALID_BUDGETS.includes(budget)) {
    return new Response("Budget is required", { status: 400 });
  }
  if (!VALID_TIMELINES.includes(timeline)) {
    return new Response("Timeline is required", { status: 400 });
  }
  if (!VALID_PLATFORMS.includes(platform)) {
    return new Response("Platform is required", { status: 400 });
  }
  if (!VALID_CONTEXTS.includes(teamContext)) {
    return new Response("Context is required", { status: 400 });
  }

  const input: ScopeInput = {
    description: description.trim(),
    budget,
    timeline,
    platform,
    teamContext,
  };

  if (process.env.USE_OLLAMA === "true") {
    const ollamaModel = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: "system", content: SCOPE_SYSTEM_PROMPT },
          { role: "user", content: buildScopePrompt(input) },
        ],
        stream: true,
        think: false,
      }),
    });

    if (!res.ok || !res.body) {
      return new Response("Ollama request failed", { status: 502 });
    }

    const readable = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              const content = data.message?.content;
              if (content)
                controller.enqueue(new TextEncoder().encode(content));
            } catch {}
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const result = streamText({
    model: anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5"),
    system: SCOPE_SYSTEM_PROMPT,
    prompt: buildScopePrompt(input),
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
