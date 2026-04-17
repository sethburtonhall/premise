import Link from "next/link";
import { cn } from "@/lib/utils";
import { Crosshair } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Crosshair className="size-6 text-primary mt-1" />
      <span className="font-semibold tracking-tight text-foreground text-3xl font-display">
        Premise
      </span>
    </Link>
  );
}
