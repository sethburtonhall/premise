"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({
  content,
  cursor,
  print,
}: {
  content: string;
  cursor?: boolean;
  print?: boolean;
}) {
  return (
    <div className={cn(
      "prose max-w-none",
      "prose-headings:font-semibold prose-headings:tracking-tight",
      "prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3",
      "prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2",
      "prose-table:text-sm prose-table:w-full",
      "prose-th:text-left prose-th:font-semibold prose-th:py-2 prose-th:pr-4",
      "prose-td:py-2 prose-td:pr-4 prose-td:align-top prose-td:border-b",
      print ? [
        "prose-p:text-zinc-700 prose-p:leading-relaxed",
        "prose-strong:text-zinc-900 prose-strong:font-semibold",
        "prose-hr:border-zinc-200 prose-hr:my-6",
        "prose-ul:text-zinc-700 prose-ul:space-y-1",
        "prose-ol:text-zinc-700 prose-ol:space-y-1",
        "prose-li:text-zinc-700",
        "prose-thead:border-zinc-200",
        "prose-th:text-zinc-900",
        "prose-td:text-zinc-700 prose-td:border-zinc-200",
      ] : [
        "dark:prose-invert",
        "prose-p:leading-relaxed prose-p:text-foreground/90",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-hr:border-border prose-hr:my-6",
        "prose-ul:space-y-1 prose-ul:text-foreground/90",
        "prose-ol:space-y-1 prose-ol:text-foreground/90",
        "prose-li:text-foreground/90",
        "prose-thead:border-b prose-thead:border-border",
        "prose-th:text-foreground",
        "prose-td:text-foreground/90 prose-td:border-border/50",
      ],
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      {cursor && (
        <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  );
}
