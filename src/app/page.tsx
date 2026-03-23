import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Crosshair,
  Layers,
  Calendar,
  ShieldAlert,
  Users,
  FileText,
  DollarSign,
  ClipboardList,
  Zap,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <ButtonLink href="/sign-up" size="sm">
              Get started free
            </ButtonLink>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <Badge
          variant="secondary"
          className="mb-6 text-xs tracking-wide uppercase"
        >
          For design agencies
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-2xl">
          Brief in.
          <br />
          <span className="text-primary">Scope out.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Most design agencies don&apos;t have a technical lead on staff.
          Premise is the next best thing — paste a client brief and get back a
          complete technical scope, ready for your proposal, in under a minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ButtonLink href="/sign-up" size="lg" className="px-8">
            Start scoping for free
          </ButtonLink>
          <ButtonLink href="#how-it-works" size="lg" variant="outline">
            See how it works
          </ButtonLink>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          2 free scopes. No credit card required.
        </p>
      </section>

      {/* The moment */}
      <section className="border-t border-border bg-card py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border-l-2 border-primary pl-10">
            <p className="text-xl sm:text-2xl leading-relaxed text-muted-foreground font-light mb-8">
              The brief lands on a Wednesday. The client wants an app — custom
              auth, payment tiers, real-time features. Your design work is
              strong. But the technical section of the proposal is where things
              get vague. You either guess, bring in a contractor, or leave it
              thin.
            </p>
            <p className="text-xl sm:text-2xl font-semibold tracking-tight">
              Premise is built for that moment.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-sm">
            From brief to proposal-ready scope in under a minute.
          </p>
          <div className="relative grid sm:grid-cols-3 gap-12">
            {/* Connector line — desktop only */}
            <div className="hidden sm:block absolute top-5 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-border" />
            {[
              {
                icon: ClipboardList,
                step: "01",
                title: "Paste the brief",
                body: "Drop in the client brief or describe the project in plain English. Add budget, timeline, and platform context.",
              },
              {
                icon: Zap,
                step: "02",
                title: "Get a scope that holds up",
                body: "Stack recommendation, phase breakdown with cost estimates, technical risks, team structure, and post-launch costs — in seconds.",
              },
              {
                icon: FileCheck,
                step: "03",
                title: "Send it with confidence",
                body: "Copy as markdown or export as PDF. Drop it into your proposal exactly as-is. No editing required.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={step} className="flex flex-col items-start sm:items-center sm:text-center">
                <div className="relative z-10 flex items-center justify-center size-10 rounded-full bg-background border border-border mb-5">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-2 tracking-widest">{step}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-border py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
            Every scope includes
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-sm">
            The sections a technical lead would write. Structured for a
            proposal.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: Layers,
                title: "Recommended stack",
                body: "Opinionated tool choices with a clear reason for each — not a list of options.",
              },
              {
                icon: Calendar,
                title: "Phase breakdown",
                body: "Discovery through launch, with week estimates and cost ranges distributed across the budget.",
              },
              {
                icon: ShieldAlert,
                title: "Technical risks",
                body: "The real problems that will bite you mid-project if they're not flagged before the contract is signed.",
              },
              {
                icon: Users,
                title: "Suggested team",
                body: "The roles you actually need, and what each person owns on the engagement.",
              },
              {
                icon: FileText,
                title: "Assumptions & exclusions",
                body: "What the scope takes as given and what's explicitly out of scope — the section that protects your margins.",
              },
              {
                icon: DollarSign,
                title: "Post-launch costs",
                body: "Estimated monthly infrastructure spend so the client isn't surprised after handoff.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border border-border rounded-lg p-5 flex gap-4"
              >
                <div className="shrink-0 mt-0.5">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
            Simple pricing
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-sm">
            Try it free. Upgrade when you&apos;re convinced.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-border rounded-xl p-8">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Free
              </div>
              <div className="text-4xl font-bold mb-1">$0</div>
              <div className="text-xs text-muted-foreground mb-8">forever</div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "2 scopes total",
                  "Full scope output",
                  "Copy as markdown",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/sign-up" variant="outline" className="w-full">
                Get started
              </ButtonLink>
            </div>

            {/* Pro */}
            <div className="border border-primary/40 rounded-xl p-8 bg-primary/5 relative">
              <Badge className="absolute top-4 right-4 text-xs">
                Most popular
              </Badge>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Pro
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-4xl font-bold">$29</div>
                <div className="text-sm text-muted-foreground mb-1.5">/ mo</div>
              </div>
              <div className="text-xs text-primary mb-8">
                or $24/mo billed annually — save $60/yr
              </div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "Unlimited scopes",
                  "Full scope history",
                  "PDF export",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/sign-up" className="w-full">
                Start free, upgrade anytime
              </ButtonLink>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Less than one hour of a contractor&apos;s time. Use it on every
                proposal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Crosshair className="size-3" />
            <span>
              Premise — built by{" "}
              <a
                href="https://roadshowcreative.com"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Roadshow Creative
              </a>
            </span>
          </div>
          <span>
            © {new Date().getFullYear()} Roadshow Creative · usepremise.app
          </span>
        </div>
      </footer>
    </div>
  );
}
