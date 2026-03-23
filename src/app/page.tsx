import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
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
        <Badge variant="secondary" className="mb-6 text-xs tracking-wide uppercase">
          For design agencies
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-2xl">
          Brief in.
          <br />
          <span className="text-primary">Scope out.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Turn a client brief into a technical scope in minutes. Stack
          recommendations, phase breakdowns, and risk analysis — ready to paste
          into your proposal.
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

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-16 tracking-tight">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe your project",
                body: "Paste a client brief or describe the project in plain English. Add budget, timeline, and platform context.",
              },
              {
                step: "02",
                title: "Claude scopes it out",
                body: "Get stack recommendations, phases with effort estimates, and key technical risks — generated in seconds.",
              },
              {
                step: "03",
                title: "Drop it into your proposal",
                body: "Copy as markdown or export as PDF. Formatted and ready to use, no editing required.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <div className="text-4xl font-bold text-primary/30 mb-4 font-mono">
                  {step}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24 px-6 bg-card">
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
                {["2 scopes total", "Full scope output", "Copy as markdown"].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>{f}</span>
                    </li>
                  )
                )}
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
              <div className="text-4xl font-bold mb-1">$19</div>
              <div className="text-xs text-muted-foreground mb-8">per month</div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
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
          <span>© {new Date().getFullYear()} Roadshow Creative</span>
        </div>
      </footer>
    </div>
  );
}
