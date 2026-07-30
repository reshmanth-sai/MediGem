import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Display({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn("text-4xl font-bold tracking-tight text-slate-900 dark:text-white", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn("text-2xl font-bold text-slate-900 dark:text-white tracking-tight", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn("text-xl font-semibold text-slate-900 dark:text-white tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-slate-900 dark:text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function Subtitle({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-base font-medium text-slate-600 dark:text-slate-300", className)} {...props}>
      {children}
    </p>
  );
}

export function BodyText({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-sm text-slate-700 dark:text-slate-200 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function Caption({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-xs font-medium text-slate-500 dark:text-slate-400", className)} {...props}>
      {children}
    </span>
  );
}

export function MutedText({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-xs text-slate-400 dark:text-slate-500", className)} {...props}>
      {children}
    </span>
  );
}

export function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <pre className={cn("font-mono text-xs p-3 bg-slate-900 text-teal-300 rounded-md overflow-x-auto", className)}>
      <code>{children}</code>
    </pre>
  );
}

export function MedicalLabel({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400", className)}>
      {children}
    </span>
  );
}
