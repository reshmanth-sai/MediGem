"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardCheck,
  ArrowRightLeft,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "red" | "neutral";
}

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
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <div
        className={cn(
          "h-10 flex items-center justify-between gap-3 px-3 text-sm transition-all duration-150 rounded-lg",
          isActive
            ? "bg-blue-50 text-blue-600 font-medium shadow-none"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal"
        )}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive ? "text-blue-600" : "text-slate-500"
            )}
            aria-hidden="true"
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </span>
        {item.badge && !collapsed && (
          <span
            className={cn(
              "text-[11px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
              item.badgeType === "red"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const careNavItems: NavigationItem[] = [
    { label: "Clinical Workstation", href: "/", icon: LayoutGrid },
    { label: "Patient Queue", href: "/history", icon: Users },
    { label: "Assessments", href: "/results/CASE-8901", icon: ClipboardCheck },
    { label: "Referral Transfers", href: "/history", icon: ArrowRightLeft },
    { label: "Clinical Chat", href: "/history", icon: MessageSquare },
    { label: "Protocols", href: "/learning", icon: ShieldCheck },
  ];

  const systemNavItems: NavigationItem[] = [
    { label: "Guidelines", href: "/learning", icon: BookOpen },
    { label: "System Controls", href: "/settings", icon: Sliders },
  ];

  return (
    <aside
      aria-label="Primary clinical workstation navigation"
      className={cn(
        "bg-white border-r border-slate-200 py-5 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen select-none transition-all duration-150 relative z-30",
        isCollapsed ? "w-[68px] px-2" : "w-[240px] px-3.5"
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between min-h-[44px] px-1.5">
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-3 min-w-0 group">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60 shadow-sm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div>
                  <span className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight block">
                    MediGem
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal leading-none mt-0.5 block">
                    Care, Connected.
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="h-8 w-8 mx-auto text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* CARE Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
              Care
            </p>
          )}
          <nav aria-label="Care Navigation" className="space-y-0.5">
            {careNavItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href) && item.href !== "/";
              return (
                <NavItem
                  key={item.label}
                  item={item}
                  isActive={Boolean(isActive)}
                  collapsed={isCollapsed}
                />
              );
            })}
          </nav>
        </div>

        {/* SYSTEM Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
              System
            </p>
          )}
          <nav aria-label="System Navigation" className="space-y-0.5">
            {systemNavItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <NavItem
                  key={item.label}
                  item={item}
                  isActive={Boolean(isActive)}
                  collapsed={isCollapsed}
                />
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area: Light/Dark Mode + Clinician Profile + Sign out */}
      <div className="pt-4 border-t border-slate-200/80 space-y-4">
        {!isCollapsed ? (
          <>
            {/* Sun / Moon theme slider */}
            <div className="flex items-center justify-between px-3 py-1">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <button
                  type="button"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={isDark}
                  className={cn(
                    "w-10 h-5 rounded-full p-0.5 transition-colors duration-200 relative flex items-center cursor-pointer",
                    isDark ? "bg-blue-600" : "bg-slate-200"
                  )}
                  aria-label="Toggle dark mode"
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                      isDark ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
                <Moon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {/* Clinician Profile */}
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 shrink-0 shadow-sm">
                DR
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  Dr. Arjun N.
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  General Medicine
                </p>
              </div>
            </div>

            {/* Sign out link */}
            <button
              type="button"
              className="flex items-center gap-2.5 px-3 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-full text-left pt-1"
            >
              <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center justify-center">
              DR
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
