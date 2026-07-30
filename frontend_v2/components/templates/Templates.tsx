import React from "react";
import { PageTitle, Subtitle } from "@/components/ui/Typography";

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
      <div>
        <PageTitle>{title}</PageTitle>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
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
      <div className="flex items-center justify-between">
        <PageTitle>{title}</PageTitle>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
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
      <PageTitle>{title}</PageTitle>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
