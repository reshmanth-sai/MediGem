"use client";

import type { Route } from "next";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SESSION } from "@/lib/session";
import { NAVIGATION, isNavActive, type NavigationItem } from "./navigation";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/workstation" className="flex items-center gap-3 min-w-0 group">
      <div className="h-8 w-8 rounded-lg bg-action-subtle text-action flex items-center justify-center shrink-0 border border-action/20">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      {!compact && (
        <div>
          <span className="text-[17px] font-bold text-ink tracking-tight leading-tight block">MediGem</span>
          <span className="text-body-sm text-ink-muted font-normal leading-none mt-0.5 block">Care, Connected.</span>
        </div>
      )}
    </Link>
  );
}

export function NavItem({
  item,
  isActive,
  collapsed = false,
  onNavigate,
}: {
  item: NavigationItem;
  isActive: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href as Route}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <div
        className={cn(
          "h-10 flex items-center gap-3 px-3 text-sm transition-colors duration-150 rounded-lg",
          isActive ? "bg-action-subtle text-action font-semibold" : "text-ink-muted hover:bg-hover hover:text-ink font-normal"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-action" : "text-ink-muted")} aria-hidden="true" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </div>
    </Link>
  );
}

/** The grouped navigation lists, shared by the sidebar and the mobile drawer. */
export function NavGroups({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAVIGATION.map((group) => (
        <div key={group.label} className="space-y-1">
          {!collapsed && (
            <p className="text-body-sm font-semibold uppercase tracking-wider text-ink-subtle px-3 pb-1">{group.label}</p>
          )}
          <nav aria-label={`${group.label} navigation`} className="space-y-0.5">
            {group.items.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isActive={isNavActive(pathname, item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>
      ))}
    </>
  );
}

export function ClinicianCard({ compact = false }: { compact?: boolean }) {
  const c = SESSION.clinician;
  return (
    <div className={cn("flex items-center gap-3", compact ? "justify-center" : "px-2 py-1.5")}>
      <div
        className="h-9 w-9 rounded-full bg-action-subtle border border-action/20 flex items-center justify-center text-body-sm font-semibold text-action shrink-0"
        aria-hidden={!compact}
        title={compact ? `${c.name}, ${c.role}` : undefined}
      >
        {c.initials}
      </div>
      {!compact && (
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-ink truncate">{c.name}</p>
          <p className="text-body-sm text-ink-muted truncate">{c.role}</p>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        "bg-surface border-r border-rule py-5 flex-col justify-between hidden md:flex shrink-0 min-h-screen select-none transition-all duration-150 relative z-30",
        isCollapsed ? "w-[68px] px-2" : "w-[240px] px-3.5"
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between min-h-[44px] px-1.5">
          {!isCollapsed ? (
            <>
              <BrandMark />
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-hover transition-colors"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="h-8 w-8 mx-auto text-action hover:bg-action-subtle rounded-md flex items-center justify-center transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <NavGroups collapsed={isCollapsed} />
      </div>

      <div className="pt-4 border-t border-rule">
        <ClinicianCard compact={isCollapsed} />
      </div>
    </aside>
  );
}
