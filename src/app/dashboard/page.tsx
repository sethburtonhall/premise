import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";
import { createServerClient } from "@/lib/supabase";
import { FREE_SCOPE_LIMIT } from "@/lib/usage";
import type { Scope } from "@/lib/supabase";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const isPro = user?.publicMetadata?.plan === "pro";

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
          <div className="flex items-center gap-4">
            {!isPro && (
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                Free · {remaining} scope{remaining !== 1 ? "s" : ""} left
              </Badge>
            )}
            {isPro && (
              <Badge className="text-xs hidden sm:inline-flex">Pro</Badge>
            )}
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Your scopes</h1>
          <ButtonLink href="/scope/new">New scope</ButtonLink>
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
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {scope.title || "Untitled scope"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scope.input?.platform} · {scope.input?.budget} ·{" "}
                      {new Date(scope.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0 mt-0.5">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl p-16 text-center">
            <p className="text-muted-foreground text-sm mb-6">
              No scopes yet. Generate your first one in seconds.
            </p>
            <ButtonLink href="/scope/new">Generate a scope</ButtonLink>
          </div>
        )}

        {!isPro && (
          <div className="mt-12 border border-primary/30 rounded-xl p-6 bg-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Unlimited scopes, saved history, and PDF export for $19/mo.
                </p>
              </div>
              <Button size="sm" className="shrink-0">
                Upgrade — $19/mo
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
