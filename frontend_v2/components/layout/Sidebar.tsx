"use client";

import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, PlusCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SESSION, activeClinician } from "@/lib/session";
import { useSession } from "@/providers/SessionProvider";
import { useApiHealth } from "@/hooks/useApiHealth";
import { NAVIGATION, isNavActive, type NavigationItem } from "./navigation";

/*
 * The primary rail. One <nav> landmark with a labelled list per group, an
 * inset bar for the current page instead of a filled pill, the intake action
 * at the top because it is the workstation's main verb, and the clinician,
 * facility and pipeline state at the bottom, all read from their sources.
 *
 * Collapsed, every link keeps a real accessible name (aria-label) and shows
 * it as a tooltip on hover and on keyboard focus.
 */

const COLLAPSED_KEY = "medigem-rail-collapsed";

/** The product's mark: one PQRST beat, the same trace as the product page. */
export function EcgMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true" className={className} fill="none">
      <polyline
        points="0,15 12,15 15,15 17,13 19,17 21,3 23,21 25,15 28,15 31,11 34,15 40,15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/workstation"
      className={cn("flex items-center gap-2.5 min-w-0 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus", compact && "justify-center")}
      aria-label="MediGem, workstation home"
    >
      <EcgMark className="text-risk-high shrink-0" />
      {!compact && <span className="text-[17px] font-semibold text-ink tracking-tight leading-none">MediGem</span>}
    </Link>
  );
}

export function NavItem({ item, isActive, collapsed = false, onNavigate }: { item: NavigationItem; isActive: boolean; collapsed?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  const name = item.short ?? item.label;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        aria-label={collapsed ? name : undefined}
        onClick={onNavigate}
        className={cn(
          "group/nav relative flex items-center gap-3 h-11 rounded-control text-body-sm transition-colors",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
          collapsed ? "justify-center px-0" : "px-3",
          isActive ? "text-ink font-semibold bg-surface-sunken" : "text-ink-muted hover:text-ink hover:bg-hover"
        )}
      >
        {/* Current-page bar. Colour, not just weight, so it reads at a glance. */}
        <span aria-hidden="true" className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", isActive ? "bg-risk-high" : "bg-transparent")} />
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-ink" : "text-ink-muted group-hover/nav:text-ink")} aria-hidden="true" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {collapsed && (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-control border border-rule bg-surface px-2 py-1 text-body-sm text-ink opacity-0 group-hover/nav:opacity-100 group-focus-visible/nav:opacity-100"
          >
            {name}
          </span>
        )}
      </Link>
    </li>
  );
}

/** The grouped lists, shared by the rail and the phone drawer. */
export function NavGroups({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const base = useId();
  return (
    <nav aria-label="Primary" className="flex flex-col gap-5">
      {NAVIGATION.map((group) => {
        const headingId = `${base}-${group.id}`;
        return (
          <div key={group.id}>
            <h2 id={headingId} className={cn("text-label text-ink-muted px-3 pb-1.5", collapsed && "sr-only")}>
              {group.label}
            </h2>
            <ul aria-labelledby={headingId} className="space-y-0.5 list-none m-0 p-0">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} isActive={isNavActive(pathname, item.href)} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function ClinicianCard({ compact = false }: { compact?: boolean }) {
  const session = useSession();
  const c = activeClinician();
  const api = useApiHealth();
  const dot = api.state === "up" ? "bg-risk-low" : api.state === "down" ? "bg-risk-emergency" : "bg-ink-subtle";
  const apiText = api.state === "up" ? "Pipeline API up" : api.state === "down" ? "Pipeline API not reachable" : api.state === "checking" ? "Checking pipeline API" : "Replay mode, no API";
  const signedIn = session.status === "signed-in";
  return (
    <div className={cn("flex items-center gap-3", compact ? "justify-center" : "px-1")} title={compact ? `${c.name}, ${c.role} · ${apiText}` : undefined}>
      <div className="relative shrink-0">
        <div className="h-9 w-9 rounded-full bg-surface-sunken border border-rule flex items-center justify-center text-body-sm font-semibold text-ink" aria-hidden="true">
          {c.initials}
        </div>
        <span className={cn("absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface", dot)} aria-hidden="true" />
      </div>
      {!compact && (
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-ink truncate">{c.name}</p>
          <p className="text-body-sm text-ink-muted truncate">
            {c.roleShort} · {signedIn ? "Signed in" : SESSION.facility.name}
          </p>
        </div>
      )}
      {signedIn && !compact && (
        <button
          type="button"
          onClick={() => session.logout()}
          aria-label="Sign out"
          title="Sign out"
          className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <span className="sr-only">{apiText}</span>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const railId = useId();

  // Remembered per browser. Read after mount so the server and first client
  // paint agree; a rail that snaps closed a frame later is better than a
  // hydration mismatch.
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      // Storage unavailable; stay expanded.
    }
  }, []);
  const toggle = () => {
    setCollapsed((v) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, v ? "0" : "1");
      } catch {
        // ignore
      }
      return !v;
    });
  };

  return (
    <aside
      id={railId}
      aria-label="Sidebar"
      className={cn(
        "bg-surface border-r border-rule hidden md:flex flex-col shrink-0 min-h-screen sticky top-0 max-h-screen transition-[width] duration-150",
        collapsed ? "w-16 px-2" : "w-60 px-3"
      )}
    >
      <div className={cn("flex items-center h-16 border-b border-rule", collapsed ? "justify-center" : "justify-between px-1")}>
        <BrandMark compact={collapsed} />
        {!collapsed && (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-controls={railId}
            className="h-9 w-9 flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="py-4">
        <Link
          href={"/new-case" as Route}
          aria-label={collapsed ? "New patient intake" : undefined}
          data-tour="tour-new-intake"
          className={cn(
            "flex items-center gap-2 h-11 rounded-control bg-action text-on-action text-body-sm font-semibold hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            collapsed ? "justify-center" : "px-3"
          )}
        >
          <PlusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span>New patient intake</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <NavGroups collapsed={collapsed} />
      </div>

      <div className="border-t border-rule py-4 space-y-3">
        <ClinicianCard compact={collapsed} />
        {collapsed ? (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={false}
            aria-controls={railId}
            className="mx-auto h-9 w-9 flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex items-center justify-between px-1 text-body-sm text-ink-muted">
            <Link href="/" className="hover:text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
              Product page
            </Link>
            <span className="font-mono">v2</span>
          </div>
        )}
      </div>
    </aside>
  );
}
