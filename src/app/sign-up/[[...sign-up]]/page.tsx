import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <p className="text-sm text-muted-foreground">
        Brief in. Scope out. 2 free scopes — no card required.
      </p>
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  );
}
