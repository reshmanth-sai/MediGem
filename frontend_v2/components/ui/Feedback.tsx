import React from "react";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No Analysis Executed",
  message = "Upload a medical file or click a Demo Preset to begin analysis.",
  icon = "🩺",
  className,
}: {
  title?: string;
  message?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/50",
        className
      )}
    >
      <div className="text-3xl">{icon}</div>
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{message}</p>
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
}
