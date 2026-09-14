"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { BrandMark, ClinicianCard, NavGroups } from "./Sidebar";

/*
 * The navigation under 768px: a panel that slides in from the left over the
 * page. Escape and the backdrop close it; focus moves into the panel while it
 * is open and back to the opener when it closes.
 */
export function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close navigation" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] bg-surface border-r border-rule flex flex-col justify-between py-5 px-3.5 overflow-y-auto"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between min-h-[44px] px-1.5">
            <BrandMark />
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-hover"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <NavGroups onNavigate={onClose} />
        </div>
        <div className="pt-4 border-t border-rule">
          <ClinicianCard />
        </div>
      </div>
    </div>
  );
}
