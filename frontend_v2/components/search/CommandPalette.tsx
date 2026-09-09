"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, PlusCircle, History, Award, Settings, Terminal, BookOpen } from "lucide-react";
import { ModalDialog } from "@/components/ui/Dialog";
import { BodySm } from "@/components/ui/Typography";

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { title: "Today's Clinical Work", route: "/", icon: Home },
    { title: "New Patient Intake", route: "/new-case", icon: PlusCircle },
    { title: "Patient Queue & Archive", route: "/history", icon: History },
    { title: "Clinical Guidelines & Protocols", route: "/learning", icon: BookOpen },
    { title: "Clinical Sample Presets", route: "/demo", icon: Award },
    { title: "System Benchmarks & Quality", route: "/evaluation", icon: Terminal },
    { title: "Pipeline Inspector & Diagnostics", route: "/developer", icon: Terminal },
    { title: "Workstation Settings", route: "/settings", icon: Settings },
  ];

  const filtered = commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (route: string) => {
    setIsOpen(false);
    router.push(route as any);
  };

  if (!isOpen) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Command Palette"
      className="max-w-xl"
    >
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search page"
            aria-label="Search commands and pages"
            className="w-full h-11 pl-9 pr-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors"
            autoFocus
          />
        </div>

        <ul className="space-y-1 max-h-60 overflow-y-auto" role="list">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <li key={cmd.title}>
                <button
                  type="button"
                  onClick={() => handleNavigate(cmd.route)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-control text-left hover:bg-action-subtle hover:text-action transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  <span className="flex-1 min-w-0 truncate text-body-sm font-semibold text-ink">
                    {cmd.title}
                  </span>
                  <span className="text-label font-mono text-ink-muted shrink-0">{cmd.route}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <BodySm className="text-ink-muted py-2">No commands match that search.</BodySm>
        )}
      </div>
    </ModalDialog>
  );
}
