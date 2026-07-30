"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A10] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Floating "+ New Case" FAB Button ⭐⭐⭐⭐☆ */}
      <Link href="/new-case" className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          className="shadow-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black px-5 py-3 rounded-full flex items-center space-x-2.5 border border-emerald-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-teal-500/20 group"
          title="Start New Patient Case Workflow"
        >
          <Plus className="h-5 w-5 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-extrabold tracking-tight">New Case</span>
        </button>
      </Link>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
