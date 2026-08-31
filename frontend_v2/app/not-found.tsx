import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Server component. The single action is a plain navigation, so it goes
 * through EmptyState's href variant and renders a real anchor rather than a
 * router.push handler, which means no "use client" boundary is needed here.
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-ground p-4">
      <div className="max-w-md w-full">
        <EmptyState
          icon={FileQuestion}
          title="Page not found"
          description="The clinical workspace page you requested does not exist or has been relocated."
          action={{ label: "Return to Dashboard", href: "/" }}
        />
      </div>
    </div>
  );
}
