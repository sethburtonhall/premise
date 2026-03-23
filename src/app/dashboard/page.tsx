import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { createServerClient } from "@/lib/supabase";
import { FREE_SCOPE_LIMIT } from "@/lib/usage";
import { DeleteScopeButton } from "@/components/delete-scope-button";
import type { Scope } from "@/lib/supabase";
import type { SessionClaims } from "@/types/auth";

const PLATFORM_LABELS: Record<string, string> = {
  "web-app": "Web app",
  "marketing-site": "Marketing site",
  "mobile-app": "Mobile app",
  ecommerce: "E-commerce",
  "api-backend": "API / backend",
  other: "Other",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-10k": "Under $10k",
  "10k-50k": "$10k–$50k",
  "50k-100k": "$50k–$100k",
  "100k-plus": "$100k+",
  unknown: "Budget TBD",
};

export default async function DashboardPage() {
  const { userId, has, sessionClaims } = await auth();
  const isPro =
    has({ plan: "pro" }) ||
    (sessionClaims as SessionClaims)?.metadata?.special_access === true;

  const supabase = createServerClient();
  const { data: scopes } = await supabase
    .from("scopes")
    .select("id, title, created_at, input")
    .eq("user_id", userId!)
    .order("created_at", { ascending: false });

  const scopeCount = scopes?.length ?? 0;
  const remaining = Math.max(0, FREE_SCOPE_LIMIT - scopeCount);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isPro && (
              <Badge
                variant="secondary"
                className="text-xs hidden sm:inline-flex"
              >
                Free · {remaining} scope{remaining !== 1 ? "s" : ""} left
              </Badge>
            )}
            {isPro &&
              !(sessionClaims as SessionClaims)?.metadata?.special_access ===
                true && (
                <Badge className="text-xs hidden sm:inline-flex">Pro</Badge>
              )}
            {(sessionClaims as SessionClaims)?.metadata?.special_access ===
              true && (
              <Badge className="text-xs hidden sm:inline-flex bg-green-500/10 text-green-600 border-green-500/20">
                Special Access
              </Badge>
            )}
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Your scopes</h1>
          {scopeCount > 0 && (
            <ButtonLink href="/scope/new">New scope</ButtonLink>
          )}
        </div>

        {scopes && scopes.length > 0 ? (
          <div className="space-y-3">
            {(scopes as Scope[]).map((scope) => (
              <Link
                key={scope.id}
                href={`/scope/${scope.id}`}
                className="block border border-border rounded-lg p-5 hover:border-primary/40 hover:bg-card transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {scope.title || "Untitled scope"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scope.input?.platform
                        ? (PLATFORM_LABELS[scope.input.platform] ??
                          scope.input.platform)
                        : null}
                      {scope.input?.platform && scope.input?.budget
                        ? " · "
                        : null}
                      {scope.input?.budget
                        ? (BUDGET_LABELS[scope.input.budget] ??
                          scope.input.budget)
                        : null}
                      {" · "}
                      {new Date(scope.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 mt-0.5">
                    {isPro && (
                      <DeleteScopeButton
                        scopeId={scope.id}
                        scopeTitle={scope.title || "Untitled scope"}
                      />
                    )}
                    <span className="text-muted-foreground text-xs">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground text-base mb-1">
              Your next proposal is waiting.
            </p>
            <p className="text-muted-foreground text-base mb-6">
              Paste a client brief and get a technical scope in seconds.
            </p>
            <ButtonLink href="/scope/new">Generate a scope</ButtonLink>
          </div>
        )}

        {!isPro && (
          <div className="mt-12 border border-primary/30 rounded-xl p-6 bg-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-base">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Every proposal deserves a proper technical scope.
                </p>
              </div>
              <ButtonLink href="/upgrade" size="sm" className="shrink-0">
                Upgrade — $29/mo
              </ButtonLink>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
