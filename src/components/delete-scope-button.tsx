"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function DeleteScopeButton({
  scopeId,
  scopeTitle,
  redirectOnDelete,
  variant = "icon",
}: {
  scopeId: string;
  scopeTitle: string;
  redirectOnDelete?: string;
  variant?: "icon" | "button";
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/scope/${scopeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Scope deleted");
      setTimeout(() => {
        window.location.href = redirectOnDelete ?? "/dashboard";
      }, 600);
    } catch {
      toast.error("Failed to delete scope. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
          aria-label="Delete scope"
        >
          <Trash2 className="size-3.5" />
        </button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2 className="size-3.5 mr-2" />
          Delete
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this scope?</DialogTitle>
            <DialogDescription className="pt-1">
              <span className="font-medium text-foreground">
                &ldquo;{scopeTitle}&rdquo;
              </span>{" "}
              will be permanently deleted. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="destructive"
              className="flex-1"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete scope"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
