import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Display({ children, className, as: Component = "h1", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-display text-ink", className),
      ...props,
    },
    children
  );
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-h1 text-ink", className),
      ...props,
    },
    children
  );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-h2 text-ink", className),
      ...props,
    },
    children
  );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-h3 text-ink", className),
      ...props,
    },
    children
  );
}

export function Body({ children, className, as: Component = "p", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-body text-ink max-w-[70ch]", className),
      ...props,
    },
    children
  );
}

export function BodySm({ children, className, as: Component = "p", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-body-sm text-ink", className),
      ...props,
    },
    children
  );
}

export function Label({ children, className, as: Component = "span", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-label uppercase text-ink-muted", className),
      ...props,
    },
    children
  );
}

export function Data({ children, className, as: Component = "span", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-data text-ink font-mono tabular", className),
      ...props,
    },
    children
  );
}

export function DataLg({ children, className, as: Component = "span", ...props }: TypographyProps) {
  return React.createElement(
    Component,
    {
      className: cn("text-data-lg text-ink font-mono tabular", className),
      ...props,
    },
    children
  );
}
