"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Variant = "default" | "outline" | "ghost" | "secondary" | "destructive";

export function CopyButton({ text, variant = "default" }: { text: string; variant?: Variant }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button size="sm" variant={variant} onClick={handleCopy}>
      {copied ? "Copied!" : "Copy markdown"}
    </Button>
  );
}
