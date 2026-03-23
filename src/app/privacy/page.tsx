import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "Privacy Policy — Premise",
  description: "Privacy Policy for Premise by Roadshow Creative.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: March 2026
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Premise is operated by Roadshow Creative. This Privacy Policy
              explains what data we collect, how we use it, and your rights
              regarding that data. We keep this simple — Premise is a focused
              tool and we collect only what we need to make it work.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Data We Collect</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Account data</strong> — your
                name, email address, and authentication details, collected when
                you sign up via Clerk.
              </li>
              <li>
                <strong className="text-foreground">Scope inputs</strong> — the
                project descriptions, budget ranges, timelines, and context you
                submit when generating a scope.
              </li>
              <li>
                <strong className="text-foreground">Scope outputs</strong> — the
                generated scope documents, stored so you can access your
                history.
              </li>
              <li>
                <strong className="text-foreground">Billing data</strong> —
                subscription status and payment details, processed and stored by
                Stripe. We do not store card numbers.
              </li>
              <li>
                <strong className="text-foreground">Usage data</strong> — basic
                usage metrics such as number of scopes generated, used to
                enforce plan limits.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              3. How We Use Your Data
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>To generate scope documents in response to your inputs.</li>
              <li>To authenticate your account and enforce plan limits.</li>
              <li>To process subscription billing and send receipts.</li>
              <li>To store your scope history so you can access it later.</li>
              <li>To improve the Service over time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              4. Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Premise relies on the following third-party services to operate:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Clerk</strong> — handles
                user authentication and session management.{" "}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Clerk Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Supabase</strong> — stores
                your scope data in a managed PostgreSQL database hosted on AWS.{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Anthropic</strong> —
                processes your brief inputs to generate scope documents. Your
                inputs are sent to Anthropic's API. Anthropic's usage policies
                apply.{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Anthropic Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — handles
                payment processing for Pro subscriptions.{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Stripe Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — hosts the
                Premise application.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              5. AI and Your Brief Data
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you generate a scope, the project description you enter is
              sent to Anthropic's API for processing. Do not include
              confidential client information, personally identifiable
              information, or sensitive business data in your brief inputs. You
              are responsible for ensuring your use of Premise complies with any
              confidentiality obligations you have to your clients.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your account data and scope history are retained for as long as
              your account is active. If you delete your account, your data will
              be removed from our systems within 30 days. Scopes you delete from
              your dashboard are soft-deleted and permanently removed within 30
              days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may request access to, correction of, or deletion of your
              personal data at any time by{" "}
              <a
                href="mailto:hello@roadshowcreative.dev"
                className="text-primary hover:underline"
              >
                emailing us
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Premise uses cookies and local storage for authentication session
              management only. We do not use tracking cookies or third-party
              advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              9. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting the updated policy on
              this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this Privacy Policy?{" "}
              <a
                href="mailto:hello@roadshowcreative.dev"
                className="text-primary hover:underline"
              >
                Email us
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto flex gap-6 text-xs text-muted-foreground">
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
