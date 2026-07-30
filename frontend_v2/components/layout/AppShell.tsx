"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A10] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Layout (Full Height Canvas) */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
