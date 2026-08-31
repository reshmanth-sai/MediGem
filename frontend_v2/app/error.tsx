"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary intercepted crash:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-ground p-4">
      <div className="max-w-md w-full" role="alert">
        <EmptyState
          icon={AlertTriangle}
          title="Application error detected"
          description={
            error.message ||
            "An unexpected error occurred in the clinical application layer."
          }
          action={{ label: "Try again", onClick: () => reset() }}
        />
      </div>
    </div>
  );
}
