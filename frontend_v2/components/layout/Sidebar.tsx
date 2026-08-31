"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  Stethoscope,
  BookOpen,
  Sliders,
  Terminal,
  BarChart2,
  Sparkles,
  Award,
  Plus,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
  Search,
  Bell,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

/** Shared chrome for every collapsible label, so expand and collapse stay in step. */
const collapsibleLabel = (collapsed: boolean) =>
  cn(
    "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden truncate",
    collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[150px]"
  );

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: NavigationItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href as any}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      className="block rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <div
        className={cn(
          "h-10 flex items-center justify-between gap-2 rounded-control px-2.5 text-body-sm font-semibold transition-colors duration-200 overflow-hidden border",
          isActive
            ? "bg-action-subtle text-action border-action/40"
            : "border-transparent text-ink-muted hover:bg-surface-raised hover:text-ink"
        )}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <Icon
            className={cn("h-4 w-4 shrink-0", isActive ? "text-action" : "text-ink-muted")}
            aria-hidden="true"
          />
          <span className={collapsibleLabel(collapsed)}>{item.label}</span>
        </span>
        {item.badge && (
          <span
            className={cn(
              "text-label font-mono px-1.5 py-0.5 rounded-chip bg-surface-raised text-ink-muted border border-rule shrink-0 transition-all duration-300",
              collapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[48px]"
            )}
          >
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function NavGroup({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p
        className={cn(
          "text-label uppercase text-ink-muted px-2 transition-all duration-300 whitespace-nowrap overflow-hidden",
          collapsed ? "opacity-0 max-w-0 px-0 h-0" : "opacity-100 max-w-[200px]"
        )}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);

  const effectiveCollapsed = isCollapsed && !isHovered;

  const handleOpenSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const mainNavItems: NavigationItem[] = [
    { label: "Command Center", href: "/", icon: Activity, badge: "LIVE" },
    { label: "Patient Triage Queue", href: "/history", icon: ClipboardList, badge: "14" },
  ];

  const patientWorkspaceItems: NavigationItem[] = [
    { label: "Clinical Decision Center", href: "/results/CASE-8901", icon: Stethoscope },
  ];

  const systemItems: NavigationItem[] = [
    { label: "Learning & Protocol Hub", href: "/learning", icon: BookOpen },
    { label: "System Control Center", href: "/settings", icon: Sliders },
  ];

  const devItems: NavigationItem[] = [
    { label: "Developer Inspector", href: "/developer", icon: Terminal },
    { label: "Evaluation Benchmarks", href: "/evaluation", icon: BarChart2 },
    { label: "AI Co-Pilot & Demo", href: "/demo", icon: Sparkles },
    { label: "Live Presentation", href: "/presentation", icon: Award },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Primary"
      className={cn(
        "bg-surface border-r border-rule py-3 flex-col justify-between hidden md:flex shrink-0 min-h-screen select-none transition-all duration-300 relative z-50 overflow-hidden",
        effectiveCollapsed ? "w-[68px] px-3" : "w-64 px-4"
      )}
      suppressHydrationWarning
    >
      <div className="flex flex-col gap-2.5">
        {/* Brand header and collapse toggle */}
        <div className="flex items-center min-h-[40px]">
          {!effectiveCollapsed ? (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-h3 text-ink truncate">MediGem</span>
                <span className="text-label font-mono text-ink-muted bg-surface-raised border border-rule px-1.5 py-0.5 rounded-chip shrink-0">
                  v3.3
                </span>
              </span>
              <button
                onClick={() => setIsCollapsed(true)}
                className="h-9 w-9 flex items-center justify-center text-ink-muted hover:text-ink bg-surface-raised border border-rule rounded-control transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="h-10 w-10 mx-auto rounded-control bg-action-subtle text-action border border-action/40 flex items-center justify-center transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Signed-in clinician */}
        <div
          className="h-10 rounded-control bg-surface-raised border border-rule flex items-center justify-between px-1.5"
          title="Dr. Vikram Patel (Community Health Officer)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className="h-7 w-7 rounded-chip bg-action-subtle text-action border border-action/40 flex items-center justify-center font-semibold text-body-sm shrink-0"
            >
              VP
            </span>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden",
                effectiveCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[150px]"
              )}
            >
              <p className="text-body-sm font-semibold text-ink truncate">Dr. Vikram Patel</p>
              <p className="text-label text-ink-muted truncate">CHO, Rampur</p>
            </div>
          </div>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 text-ink-muted shrink-0 transition-opacity duration-300",
              effectiveCollapsed ? "opacity-0" : "opacity-100"
            )}
          />
        </div>

        {/* Primary intake action */}
        <Link
          href="/new-case"
          title="Start patient intake"
          className={cn(
            "h-10 w-full rounded-control bg-action text-on-action font-semibold text-body-sm transition-colors duration-200 hover:bg-action-hover active:bg-action-active flex items-center justify-center gap-2 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            effectiveCollapsed ? "px-0" : "px-3"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className={collapsibleLabel(effectiveCollapsed)}>New Patient Intake</span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={handleOpenSearch}
          className="h-10 w-full rounded-control bg-surface-raised border border-rule text-ink-muted hover:text-ink hover:border-rule-strong transition-colors flex items-center justify-between gap-2 px-2.5 text-body-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          title="Search patients and symptoms (Cmd K)"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={collapsibleLabel(effectiveCollapsed)}>Search</span>
          </span>
          <kbd
            className={cn(
              "px-1.5 py-0.5 rounded-chip bg-surface border border-rule text-label font-mono text-ink-muted transition-all duration-300",
              effectiveCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[64px]"
            )}
          >
            Cmd K
          </kbd>
        </button>

        <div className="border-t border-rule my-0.5" />

        {/* Core navigation */}
        <nav className="flex flex-col gap-2.5">
          <NavGroup title="Operations" collapsed={effectiveCollapsed}>
            {mainNavItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isActive={pathname === item.href}
                collapsed={effectiveCollapsed}
              />
            ))}
          </NavGroup>

          <NavGroup title="Workspace" collapsed={effectiveCollapsed}>
            {patientWorkspaceItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isActive={pathname.startsWith("/results")}
                collapsed={effectiveCollapsed}
              />
            ))}
          </NavGroup>

          <NavGroup title="System" collapsed={effectiveCollapsed}>
            {systemItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isActive={pathname === item.href}
                collapsed={effectiveCollapsed}
              />
            ))}
          </NavGroup>

          {/* Developer and sandbox, only while expanded */}
          {!effectiveCollapsed && (
            <div className="pt-2 border-t border-rule">
              <button
                onClick={() => setShowDevMode(!showDevMode)}
                aria-expanded={showDevMode}
                className="w-full flex items-center justify-between px-2 py-1 text-label uppercase text-ink-muted hover:text-ink transition-colors rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Developer &amp; Sandbox</span>
                </span>
                {showDevMode ? (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              {showDevMode && (
                <div className="flex flex-col gap-1 pt-1">
                  {devItems.map((item) => (
                    <NavItem
                      key={item.label}
                      item={item}
                      isActive={pathname === item.href}
                      collapsed={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Footer alerts and telemetry */}
      <div className="flex flex-col gap-2 pt-2 border-t border-rule">
        {/* Pending emergency case */}
        <button
          className="h-10 w-full rounded-control bg-surface-raised border border-rule hover:border-risk-emergency transition-colors flex items-center px-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          title="1 emergency case pending"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Bell className="h-4 w-4 text-risk-emergency shrink-0" aria-hidden="true" />
            <span
              className={cn(
                "text-body-sm font-semibold text-risk-emergency transition-all duration-300 whitespace-nowrap overflow-hidden truncate",
                effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[140px]"
              )}
            >
              1 emergency pending
            </span>
          </span>
        </button>

        {/* Local telemetry */}
        <div
          className="h-10 w-full rounded-control bg-surface-raised border border-rule flex items-center px-2.5 overflow-hidden"
          title="100% offline mode (local Gemma 3 4B active)"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-risk-low shrink-0"
            />
            <span
              className={cn(
                "text-body-sm text-ink-muted transition-all duration-300 whitespace-nowrap overflow-hidden truncate",
                effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[140px]"
              )}
            >
              100% Edge Offline
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
