import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@/lib/supabase";
import { canGenerateScope } from "@/lib/usage";
import { CopyButton } from "@/components/copy-button";
import { ButtonLink } from "@/components/button-link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ExportPdfButton } from "@/components/export-pdf-button";
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
  unknown: "Platform TBD",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-10k": "Under $10k",
  "10k-50k": "$10k–$50k",
  "50k-100k": "$50k–$100k",
  "100k-plus": "$100k+",
  unknown: "Budget TBD",
};

export default async function ScopePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, has, sessionClaims } = await auth();
  const isPro =
    has({ plan: "pro" }) ||
    (sessionClaims as SessionClaims)?.metadata?.special_access === true;

  const supabase = createServerClient();
  const { data: scope } = await supabase
    .from("scopes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId!)
    .single();

  if (!scope) notFound();

  const s = scope as Scope;
  const { allowed: canGenerate } = await canGenerateScope(userId!, isPro);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonLink href="/dashboard" variant="outline" size="sm">
              ← Dashboard
            </ButtonLink>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-3">
            {s.title || "Technical Scope"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {s.input?.platform && (
              <Badge variant="secondary">
                {PLATFORM_LABELS[s.input.platform] ?? s.input.platform}
              </Badge>
            )}
            {s.input?.budget && (
              <Badge variant="secondary">
                {BUDGET_LABELS[s.input.budget] ?? s.input.budget}
              </Badge>
            )}
            <span>
              {new Date(s.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Brief */}
        {s.input?.description && (
          <div className="mb-8 border border-border rounded-lg p-5 bg-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Client brief
            </p>
            <p className="leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {s.input.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <CopyButton text={s.output} />
            {isPro && <ExportPdfButton scopeId={s.id} />}
          </div>
          <div className="flex items-center gap-2 group">
            {canGenerate && (
              <ButtonLink href="/scope/new" size="sm" variant="ghost">
                + New scope
              </ButtonLink>
            )}
            {isPro && (
              <>
                <div className="w-px h-5 bg-border" />
                <DeleteScopeButton
                  scopeId={s.id}
                  scopeTitle={s.title || "Untitled scope"}
                  redirectOnDelete="/dashboard"
                  variant="button"
                />
              </>
            )}
          </div>
        </div>

        {/* Scope output */}
        <div className="border border-border rounded-lg p-8 bg-card">
          <MarkdownRenderer content={s.output} />
        </div>

        {/* Roadshow CTA */}
        <div className="mt-6 border border-border rounded-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium">
              Need someone to actually build this?
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Roadshow Creative offers embedded technical leadership for
              agencies — from scope to shipped.
            </p>
          </div>
          <a
            href="https://www.roadshowcreative.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Learn more →
          </a>
        </div>
      </main>
    </div>
  );
}
