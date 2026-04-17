import { PricingTable } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/button-link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function UpgradePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonLink href="/dashboard" variant="outline" size="sm">
              ← Back
            </ButtonLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="text-left sm:text-center mb-12">
          <h1 className="text-2xl font-bold tracking-tight mb-3">
            Upgrade to Premise Pro
          </h1>
          <p className="text-base text-muted-foreground">
            Unlimited scopes, saved history, and PDF export.
          </p>
        </div>

        <PricingTable />
      </main>
    </div>
  );
}
