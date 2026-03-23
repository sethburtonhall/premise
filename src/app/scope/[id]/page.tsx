import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@/lib/supabase";
import { CopyButton } from "@/components/copy-button";
import { ButtonLink } from "@/components/button-link";
import type { Scope } from "@/lib/supabase";

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

export default async function ScopePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const supabase = createServerClient();
  const { data: scope } = await supabase
    .from("scopes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId!)
    .single();

  if (!scope) notFound();

  const s = scope as Scope;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard
          </Link>
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
              Original brief
            </p>
            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {s.input.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mb-8">
          <CopyButton text={s.output} />
          <ButtonLink href="/scope/new" size="sm" variant="outline">New scope</ButtonLink>
        </div>

        {/* Scope output */}
        <div className="border border-border rounded-lg p-8 bg-card font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {s.output}
        </div>
      </main>
    </div>
  );
}
