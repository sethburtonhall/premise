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
      <nav className="border-b border-border" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <ButtonLink href="/sign-up" size="lg" className="p-4">
              Get started free
            </ButtonLink>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="main"
        className="flex-1 flex flex-col items-start sm:items-center justify-center px-6 py-24 text-left sm:text-center"
      >
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <Badge
            variant="secondary"
            className="mb-6 text-xs tracking-wide uppercase"
          >
            For design agencies
          </Badge>
        </div>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-2xl animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Brief in.
          <br />
          <span className="text-primary">Scope out.</span>
        </h1>
        <p
          className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Most design agencies don&apos;t have a technical lead on staff.
          Premise is the next best thing — paste a client brief and get back a
          complete technical scope, ready for your proposal, in under a minute —
          then know exactly who to hire to deliver it.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-3 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <ButtonLink href="/sign-up" size="lg" className="p-5">
            Start scoping for free
          </ButtonLink>
          <ButtonLink
            href="#how-it-works"
            size="lg"
            variant="outline"
            className="p-5"
          >
            See how it works
          </ButtonLink>
        </div>
        <p
          className="mt-5 text-xs text-muted-foreground animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          2 free scopes. No credit card required.
        </p>
      </section>

      {/* The moment */}
      <section className="border-t border-border bg-card py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed sm:leading-snug lg:leading-tight text-muted-foreground font-light mb-10 max-w-3xl">
            The brief lands on a Wednesday. The client wants an app — custom
            auth, payment tiers, real-time features. Your design work is strong.
            But the technical section of the proposal is where things get vague.
            You either guess, bring in a contractor, or leave it thin.
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-display">
            Premise is built for that moment.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border py-24 lg:py-32 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-left sm:text-center mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-left sm:text-center text-muted-foreground mb-16 text-base">
            From brief to proposal-ready scope in under a minute.
          </p>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Paste the brief",
                body: "Drop in the client brief or describe the project in plain English. Add budget, timeline, and platform context.",
              },
              {
                step: "02",
                title: "Get a scope that holds up",
                body: "Stack recommendation, phase breakdown with cost estimates, technical risks, suggested team, and post-launch costs — in seconds.",
              },
              {
                step: "03",
                title: "Send it with confidence",
                body: "Copy as markdown or export as PDF. Drop it into your proposal exactly as-is. No editing required.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="flex flex-col items-start sm:items-center text-left sm:text-center"
              >
                <div
                  className="text-5xl sm:text-7xl font-bold text-primary/25 leading-none mb-5 tabular-nums select-none font-display"
                  aria-hidden="true"
                >
                  {step}
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-border py-24 lg:py-32 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-left sm:text-center mb-4 tracking-tight">
            Every scope includes
          </h2>
          <p className="text-left sm:text-center text-muted-foreground mb-16 text-base">
            The sections a technical lead would write. Structured for a
            proposal.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
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
              <div key={title} className="flex gap-4">
                <Icon className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base mb-1.5">{title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24 lg:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-left sm:text-center mb-4 tracking-tight">
            Simple pricing
          </h2>
          <p className="text-left sm:text-center text-muted-foreground mb-16 text-base">
            Try it free. Upgrade when you&apos;re convinced.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-border rounded-xl p-8">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Free
              </div>
              <div className="text-4xl font-bold mb-1 font-display">$0</div>
              <div className="text-xs text-muted-foreground mb-8">forever</div>
              <ul className="space-y-3 text-base mb-8">
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
              <ButtonLink
                href="/sign-up"
                variant="outline"
                className="w-full p-5"
              >
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
                <div className="text-4xl font-bold font-display">$29</div>
                <div className="text-sm text-muted-foreground mb-1.5">/ mo</div>
              </div>
              <div className="text-xs text-primary mb-8">
                or $24/mo billed annually — save $60/yr
              </div>
              <ul className="space-y-3 text-base mb-8">
                {[
                  "Unlimited scopes",
                  "Unlimited scope history",
                  "Delete scopes",
                  "PDF export",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/sign-up" className="w-full p-5">
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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Crosshair className="size-3 shrink-0" aria-hidden="true" />
            <span>
              Premise — built by{" "}
              <a
                href="https://roadshowcreative.dev"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Roadshow Creative
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              © {new Date().getFullYear()}
              <a
                href="https://roadshowcreative.dev"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Roadshow Creative
              </a>
            </span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
