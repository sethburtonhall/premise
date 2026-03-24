"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { ScopeInput } from "@/lib/supabase";

const BUDGET_OPTIONS = [
  { value: "under-10k", label: "Under $10k" },
  { value: "10k-50k", label: "$10k – $50k" },
  { value: "50k-100k", label: "$50k – $100k" },
  { value: "100k-plus", label: "$100k+" },
  { value: "unknown", label: "Not defined yet" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP / rush" },
  { value: "1-2-months", label: "1–2 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "unknown", label: "Flexible" },
];

const PLATFORM_OPTIONS = [
  { value: "web-app", label: "Web application" },
  { value: "marketing-site", label: "Marketing / brand site" },
  { value: "mobile-app", label: "Mobile app" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "api-backend", label: "API / backend only" },
  { value: "other", label: "Other" },
];

const EXAMPLE_BRIEF: ScopeInput = {
  description:
    "A boutique fitness studio wants a booking and membership platform. Members should be able to browse class schedules, book spots, manage their membership tier (drop-in, monthly, unlimited), and receive automated reminders. Studio staff need an admin view to manage classes, view attendance, and process refunds. Stripe for payments. The studio currently uses Mindbody but wants to move off it.",
  budget: "10k-50k",
  timeline: "3-6-months",
  platform: "web-app",
  teamContext: "agency-pitching",
};

const TEAM_OPTIONS = [
  { value: "agency-pitching", label: "Agency pitching to a client" },
  { value: "agency-kicking-off", label: "Agency kicking off a project" },
  { value: "founder-building", label: "Founder building a product" },
  { value: "internal-team", label: "Internal team planning" },
];

function AnimatedDots() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c === 3 ? 0 : c + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <span className="inline-block w-4">{".".repeat(count)}</span>;
}

export default function NewScopePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ScopeInput>({
    description: "",
    budget: "",
    timeline: "",
    platform: "",
    teamContext: "",
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [generationFailed, setGenerationFailed] = useState(false);

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/scope",
    streamProtocol: "text",
    onFinish: async (_prompt, completionText) => {
      setGenerationFailed(false);
      if (!completionText) return;
      setIsSaving(true);
      try {
        const res = await fetch("/api/scope/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: formData, output: completionText }),
        });
        if (res.ok) {
          const { id } = await res.json();
          setSavedId(id);
        }
      } catch {
        toast.warning("Scope generated but couldn't be saved. Copy it now to keep it.");
      } finally {
        setIsSaving(false);
      }
    },
    onError: (err) => {
      try {
        const body = JSON.parse(err.message);
        if (body.error === "upgrade_required") {
          setShowUpgradeModal(true);
          return;
        }
      } catch {
        // fall through to generic error
      }
      setGenerationFailed(true);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error("Please describe your project first.");
      return;
    }
    setSavedId(null);
    setGenerationFailed(false);
    await complete("", { body: formData });
  };

  const loadExample = () => {
    setFormData(EXAMPLE_BRIEF);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
    toast.success("Copied to clipboard");
  };

  const hasOutput = completion.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            New scope
          </h1>
          <p className="text-muted-foreground">
            Describe the brief. We&apos;ll write the technical section.
          </p>
        </div>

        <div className={`grid gap-10 ${hasOutput ? "lg:grid-cols-2" : ""}`}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">
                  Project description{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={loadExample}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Try an example ↗
                </button>
              </div>
              <Textarea
                id="description"
                placeholder="Describe the project. What does it do? Who is it for? What problem does it solve? Include any requirements you know about."
                className="min-h-[180px] resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
              <div className="space-y-2">
                <Label>Budget range</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, budget: v ?? "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeline</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, timeline: v ?? "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, platform: v ?? "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your context</Label>
                <Select
                  value={formData.teamContext}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, teamContext: v ?? "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who is this for?" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading || !formData.description.trim()}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Generating…" : "Generate scope"}
              </Button>
              {generationFailed && !hasOutput && (
                <p className="text-sm text-destructive">
                  Generation failed. Please check your connection and try again.
                </p>
              )}
            </div>
          </form>

          {/* Output */}
          {hasOutput && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">
                  {isLoading ? (
                    <span className="text-muted-foreground">
                      Writing your scope <AnimatedDots />
                    </span>
                  ) : (
                    "Your scope"
                  )}
                </h2>
                {!isLoading && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                    >
                      Copy
                    </Button>
                    {savedId && (
                      <Button
                        size="sm"
                        onClick={() => router.push(`/scope/${savedId}`)}
                      >
                        View saved →
                      </Button>
                    )}
                    {isSaving && (
                      <span className="text-xs text-muted-foreground">
                        Saving…
                      </span>
                    )}
                  </div>
                )}
              </div>
              {generationFailed && hasOutput && (
                <div className="text-xs text-destructive/80 bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
                  Generation was interrupted — this scope may be incomplete. Try again to regenerate.
                </div>
              )}
              <div className="border border-border rounded-lg p-6 bg-card max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={completion} cursor={isLoading} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You&apos;ve used your free scopes</DialogTitle>
            <DialogDescription className="pt-2">
              Upgrade to keep generating. Every proposal your agency sends
              deserves a proper technical scope.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <ul className="space-y-2 text-sm">
              {[
                "Unlimited scope generation",
                "Full scope history & dashboard",
                "Export scopes as PDF",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={() => router.push("/upgrade")}>Upgrade to Pro — $29/mo</Button>
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
              >
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
