import Link from "next/link";
import { cn } from "@/lib/utils";
import { Crosshair } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <Crosshair className="size-5 text-primary" />
      <span className="font-semibold tracking-tight text-foreground text-2xl">
        Premise
      </span>
    </Link>
  );
}
