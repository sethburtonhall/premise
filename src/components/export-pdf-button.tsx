"use client";

import { Button } from "@/components/ui/button";

export function ExportPdfButton({ scopeId }: { scopeId: string }) {
  const handleExport = () => {
    window.open(`/scope/${scopeId}/print`, "_blank");
  };

  return (
    <Button size="sm" variant="outline" onClick={handleExport}>
      Export PDF
    </Button>
  );
}
