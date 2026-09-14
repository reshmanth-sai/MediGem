"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCommandPalette } from "@/components/search/CommandPalette";
import { SESSION } from "@/lib/session";
import { MobileNav } from "./MobileNav";
import { BrandMark } from "./Sidebar";

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

export function Header() {
  const { isDark, toggleTheme } = useTheme();
  const palette = useCommandPalette();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = useCallback(() => setNavOpen(false), []);
  // Empty until mounted so the server and first client paint agree.
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString("en-US", TIME_FORMAT).replace(",", ""));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 md:h-16 border-b border-rule bg-surface sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="md:hidden h-10 w-10 -ml-2 inline-flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="Open navigation"
          aria-expanded={navOpen}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="md:hidden"><BrandMark compact /></div>

        <button
          type="button"
          onClick={palette.open}
          className="hidden sm:flex w-full max-w-sm items-center justify-between gap-3 px-3.5 h-10 bg-surface-sunken border border-rule rounded-card text-ink-muted hover:border-rule-strong transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="Search patients, protocols, or commands"
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <span className="truncate font-normal">Search patient, protocol, or command</span>
          </span>
          <kbd className="text-body-sm font-mono bg-surface-raised border border-rule text-ink-muted rounded px-1.5 py-0.5 shrink-0">⌘K</kbd>
        </button>
        <button
          type="button"
          onClick={palette.open}
          className="sm:hidden h-10 w-10 inline-flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-hover"
          aria-label="Search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 text-body-sm shrink-0">
        <span className="hidden lg:flex items-center gap-1.5 text-ink font-medium">
          <MapPin className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          {SESSION.facility.name}
        </span>
        <time className="hidden md:block text-ink-muted font-mono tabular" suppressHydrationWarning>{now}</time>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
          className="h-9 w-9 inline-flex items-center justify-center text-ink-muted hover:text-ink hover:bg-hover rounded-control transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <MobileNav isOpen={navOpen} onClose={closeNav} />
    </header>
  );
}
