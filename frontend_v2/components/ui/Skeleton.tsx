import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * Skeleton: loading placeholder shaped like the content it replaces.
 * Callers compose skeletons stacked to match the structure of real content.
 * Respects prefers-reduced-motion by honouring motion-reduce:animate-none.
 */
export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface-raised rounded-control animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}
