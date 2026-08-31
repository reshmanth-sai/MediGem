import React from "react";
import { H1, Body } from "@/components/ui/Typography";

export function DashboardTemplate({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <H1>{title}</H1>
        {subtitle && <Body className="text-ink-muted">{subtitle}</Body>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function WorkspaceTemplate({
  leftSidebar,
  centerWorkspace,
  rightResults,
}: {
  leftSidebar: React.ReactNode;
  centerWorkspace: React.ReactNode;
  rightResults: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-3 space-y-4">{leftSidebar}</div>
      <div className="lg:col-span-4 space-y-4">{centerWorkspace}</div>
      <div className="lg:col-span-5 space-y-4">{rightResults}</div>
    </div>
  );
}

export function ResultsTemplate({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <H1>{title}</H1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function HistoryTemplate({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <H1>{title}</H1>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
