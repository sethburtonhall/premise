"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type Props = VariantProps<typeof buttonVariants> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  target,
  rel,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
