"use client";

import React, { useState, useEffect } from "react";
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

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className={cn(
        "theme-card border-r border-inherit py-3 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen select-none transition-all duration-300 cubic-bezier(0.4,0,0.2,1) relative z-50 shadow-2xl overflow-hidden",
        effectiveCollapsed ? "w-[68px] px-3" : "w-64 px-4"
      )}
      suppressHydrationWarning
    >
      <div className="flex flex-col gap-2.5">
        {/* Brand Header & Toggle */}
        <div className="flex items-center min-h-[40px]">
          {!effectiveCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20 shrink-0 text-sm">
                  💎
                </div>
                <h1 className="text-xs font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 font-mono">
                  MediGem <span className="text-[9px] text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/30 font-bold">v3.3</span>
                </h1>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white theme-card border rounded-lg transition-colors shrink-0"
                title="Minimize Sidebar"
              >
                <PanelLeftClose className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="h-10 w-10 mx-auto rounded-xl bg-teal-500/20 border border-teal-500/40 hover:border-teal-400 flex items-center justify-center text-teal-400 shadow-md transition-all shrink-0 group"
              title="Expand Sidebar"
            >
              <span className="group-hover:hidden text-base">💎</span>
              <PanelLeftOpen className="h-4 w-4 text-teal-400 hidden group-hover:block" />
            </button>
          )}
        </div>

        {/* Clinician Card */}
        <div
          className="h-10 rounded-xl theme-card border flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors px-1.5"
          title="Dr. Vikram Patel (Community Health Officer)"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-[11px] shrink-0">
              VP
            </div>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden",
                effectiveCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[150px]"
              )}
            >
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Dr. Vikram Patel</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> CHO • Rampur
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-slate-500 shrink-0 transition-opacity duration-300",
              effectiveCollapsed ? "opacity-0" : "opacity-100"
            )}
          />
        </div>

        {/* Intake Primary CTA */}
        <div>
          <Link href="/new-case">
            <button
              className={cn(
                "w-full rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-md border border-teal-300 transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden h-10",
                effectiveCollapsed ? "px-0" : "px-3"
              )}
              title="Start Patient Intake"
            >
              <Plus className="h-4 w-4 shrink-0 stroke-[3]" />
              <span
                className={cn(
                  "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden tracking-tight",
                  effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[150px]"
                )}
              >
                + New Patient Intake
              </span>
            </button>
          </Link>
        </div>

        {/* Search Trigger Quick Action */}
        <button
          onClick={handleOpenSearch}
          className="h-10 w-full rounded-xl theme-card border hover:border-teal-500/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center justify-between px-2.5 font-mono text-xs group"
          title="Search Patients & Symptoms (Cmd + K)"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-teal-400 transition-colors" />
            <span
              className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden truncate",
                effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[140px]"
              )}
            >
              Search...
            </span>
          </div>
          <kbd
            className={cn(
              "px-1.5 py-0.5 rounded bg-slate-950/20 border border-slate-700 text-[9.5px] font-bold text-slate-400 transition-all duration-300",
              effectiveCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[35px]"
            )}
          >
            ⌘K
          </kbd>
        </button>

        {/* Divider */}
        <div className="border-t border-inherit my-0.5" />

        {/* Core Navigation Items */}
        <nav className="flex flex-col gap-2.5">
          {/* Operations */}
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono transition-all duration-300 whitespace-nowrap overflow-hidden px-2",
                effectiveCollapsed ? "opacity-0 max-w-0 px-0 h-0" : "opacity-100 max-w-[200px]"
              )}
            >
              OPERATIONS
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href as any} className="block" title={item.label}>
                  <div
                    className={cn(
                      "h-10 relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group justify-between overflow-hidden px-2.5",
                      isActive
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/50 shadow-sm font-bold"
                        : "theme-card border-transparent opacity-80 hover:opacity-100 hover:border-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                      <span
                        className={cn(
                          "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden truncate",
                          effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[150px]"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded theme-card border shrink-0 transition-all duration-300",
                          effectiveCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[40px]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Clinical Workspace */}
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono transition-all duration-300 whitespace-nowrap overflow-hidden px-2",
                effectiveCollapsed ? "opacity-0 max-w-0 px-0 h-0" : "opacity-100 max-w-[200px]"
              )}
            >
              WORKSPACE
            </p>
            {patientWorkspaceItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith("/results");
              return (
                <Link key={item.label} href={item.href as any} className="block" title={item.label}>
                  <div
                    className={cn(
                      "h-10 relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group justify-between overflow-hidden px-2.5",
                      isActive
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/50 shadow-sm font-bold"
                        : "theme-card border-transparent opacity-80 hover:opacity-100 hover:border-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                      <span
                        className={cn(
                          "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden truncate",
                          effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[150px]"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* System & Hub */}
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono transition-all duration-300 whitespace-nowrap overflow-hidden px-2",
                effectiveCollapsed ? "opacity-0 max-w-0 px-0 h-0" : "opacity-100 max-w-[200px]"
              )}
            >
              SYSTEM
            </p>
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href as any} className="block" title={item.label}>
                  <div
                    className={cn(
                      "h-10 relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group justify-between overflow-hidden px-2.5",
                      isActive
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/50 shadow-sm font-bold"
                        : "theme-card border-transparent opacity-80 hover:opacity-100 hover:border-slate-400"
                    )}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                      <span
                        className={cn(
                          "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden truncate",
                          effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[150px]"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sandbox & Dev (Only visible when Expanded) */}
          {!effectiveCollapsed && (
            <div className="pt-2 border-t border-inherit">
              <button
                onClick={() => setShowDevMode(!showDevMode)}
                className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-all duration-300 font-mono"
              >
                <span className="flex items-center gap-1.5 font-mono">
                  <Code2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>DEVELOPER & SANDBOX</span>
                </span>
                {showDevMode ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              {showDevMode && (
                <div className="flex flex-col gap-1 pt-1">
                  {devItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.label} href={item.href as any} className="block" title={item.label}>
                        <div
                          className={cn(
                            "h-10 relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group overflow-hidden px-2.5",
                            isActive
                              ? "bg-slate-800 text-teal-300 border border-slate-700"
                              : "theme-card border-transparent opacity-80 hover:opacity-100 hover:border-slate-400"
                          )}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-200" />
                            <span className="truncate">{item.label}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Footer Quick Alerts & Telemetry */}
      <div className="flex flex-col gap-2 pt-2 border-t border-inherit">
        {/* STAT Emergency Notification Alert */}
        <button
          className="h-10 w-full rounded-xl theme-card border hover:border-rose-500/40 transition-all flex items-center justify-between px-2.5"
          title="1 STAT Emergency Pending"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="relative">
              <Bell className="h-4 w-4 text-rose-400 shrink-0" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <span
              className={cn(
                "text-xs font-bold text-rose-400 transition-all duration-300 whitespace-nowrap overflow-hidden truncate",
                effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[140px]"
              )}
            >
              1 STAT Emergency
            </span>
          </div>
        </button>

        {/* Local Telemetry Badge */}
        <div
          className="h-10 w-full rounded-xl theme-card border flex items-center justify-between px-2.5 font-mono overflow-hidden"
          title="100% Offline Mode (Local Gemma 3 4B Active)"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-md shadow-emerald-500/50" />
            <span
              className={cn(
                "text-[10px] text-slate-500 dark:text-slate-300 font-bold transition-all duration-300 whitespace-nowrap overflow-hidden truncate",
                effectiveCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[140px]"
              )}
            >
              100% Edge Offline
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
