import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Route-level loading state. Shaped like the app shell it replaces: a nav
 * column beside a page heading and content blocks, so the layout does not
 * jump when the real content arrives. Skeleton itself honours
 * prefers-reduced-motion.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-ground flex" role="status" aria-busy="true">
      <span className="sr-only">Loading MediGem Clinical Co-Pilot</span>

      {/* Navigation column */}
      <div
        className="hidden md:flex w-64 shrink-0 flex-col gap-2.5 border-r border-rule bg-surface px-4 py-3"
        aria-hidden="true"
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="border-t border-rule my-1" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 p-6 sm:p-8 space-y-6" aria-hidden="true">
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3 max-w-md" />
          <Skeleton className="h-5 w-1/2 max-w-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>

        <Skeleton className="h-48 w-full rounded-card" />
        <Skeleton className="h-48 w-full rounded-card" />
      </div>
    </div>
  );
}
