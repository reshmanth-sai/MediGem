"use client";

import React from "react";
import { Search, CloudOff, Bell, Moon, Sun, MapPin } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  const handleOpenCommand = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header className="h-16 border-b border-rule bg-surface sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Version */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-h2 text-ink">MediGem</span>
        <span className="text-label font-mono text-ink-muted bg-surface-raised border border-rule px-2 py-0.5 rounded-chip">
          v3.3
        </span>
      </div>

      {/* Center Cmd + K search trigger */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <button
          onClick={handleOpenCommand}
          className="w-full flex items-center justify-between gap-3 px-3.5 h-11 rounded-control bg-surface-raised border border-rule text-ink-muted hover:text-ink hover:border-rule-strong transition-colors text-body-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Search patients, symptoms, IDs, protocols</span>
          </span>
          <kbd className="px-2 py-0.5 rounded-chip bg-surface border border-rule text-label font-mono text-ink-muted shrink-0">
            Cmd K
          </kbd>
        </button>
      </div>

      {/* Right telemetry and status */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Clinic location status */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 h-9 rounded-control bg-surface-raised border border-rule text-body-sm text-ink-muted">
          <MapPin className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          <span className="text-ink">Rampur Sub-Center</span>
          <span aria-hidden="true">/</span>
          <span className="text-risk-low font-semibold">Shift Active</span>
        </div>

        {/* Offline edge status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-control bg-risk-low/12 text-risk-low border border-risk-low/30 text-body-sm font-semibold">
          <CloudOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>100% Edge Offline</span>
        </div>

        {/* Emergency alert notification */}
        <button
          className="relative h-11 w-11 inline-flex items-center justify-center text-ink-muted hover:text-ink bg-surface-raised border border-rule rounded-control transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="Notifications: 1 emergency case pending"
        >
          <Bell className="h-4 w-4 text-risk-emergency" aria-hidden="true" />
          <span className="absolute top-1 right-1 min-h-[18px] min-w-[18px] px-1 rounded-full bg-risk-emergency text-on-action text-body-sm font-semibold leading-none flex items-center justify-center">
            1
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="h-11 w-11 inline-flex items-center justify-center text-ink-muted hover:text-ink bg-surface-raised border border-rule rounded-control transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
