"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ground text-ink flex">
      {/*
        WCAG 2.4.1 bypass block. Without it, every route walks a keyboard user
        through the entire sidebar before reaching any page content. This is
        the first focusable element in the shell, stays invisible until it
        takes focus, and then paints over the top left corner. `main` carries
        tabIndex={-1} so following the link actually moves focus into the
        landmark rather than only scrolling to it.
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-control focus:border focus:border-action focus:bg-surface focus:px-4 focus:text-body-sm focus:font-semibold focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-focus"
      >
        Skip to main content
      </a>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Layout (Full Height Canvas) */}
      <div className="flex-1 flex flex-col min-w-0">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-6 sm:p-8 overflow-y-auto"
        >
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
