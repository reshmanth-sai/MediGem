"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalDialog({ isOpen, onClose, title, children, className }: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  // Keep the latest onClose in a ref so the effect below doesn't need it in
  // its dependency array. Call sites pass an inline arrow function, which
  // gets a new identity on every parent re-render; if the effect depended on
  // it directly, any state update in the parent (e.g. typing into a search
  // field) would tear down and re-run the effect while the dialog stayed
  // open, firing the "restore focus to opener" cleanup on every keystroke.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Close on Escape, keep Tab focus inside the panel, and restore focus to the
  // element that opened the dialog once it closes. Depends only on `isOpen`
  // so it runs exactly once per open/close transition.
  React.useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    // Respect an element that already claimed focus on mount (e.g. a child
    // with an `autoFocus` prop, which React focuses synchronously during
    // commit before this effect runs), or one explicitly marked with the
    // native `autofocus` attribute. Only fall back to focusing the first
    // focusable element (which is often just the header's close button) if
    // nothing more specific already claimed focus.
    if (panel) {
      const alreadyFocused =
        (document.activeElement instanceof HTMLElement &&
          panel.contains(document.activeElement) &&
          document.activeElement !== panel &&
          document.activeElement !== document.body)
          ? document.activeElement
          : panel.querySelector<HTMLElement>("[autofocus]");
      if (alreadyFocused) {
        alreadyFocused.focus();
      } else {
        panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "w-full max-w-lg bg-surface-raised rounded-card border border-rule-strong p-6 space-y-4 relative",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-3">
          <h3 id={titleId} className="text-h2 text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 inline-flex h-9 w-9 -mr-1 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-rule hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
