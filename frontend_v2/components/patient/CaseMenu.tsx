"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Copy, Download, Trash2 } from "lucide-react";
import type { ClinicalCaseData } from "@/lib/casesData";
import { cn } from "@/lib/utils";

/*
 * The "..." on a case. Copy the id and export the record work for every case;
 * delete only for cases stored on the API (and asks first).
 */
export function CaseMenu({ caseData, onDelete, onNotice }: { caseData: ClinicalCaseData; onDelete?: () => Promise<void>; onNotice?: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(caseData.caseId);
      onNotice?.(`Copied ${caseData.caseId}`);
    } catch {
      onNotice?.("Clipboard is not available in this browser.");
    }
    setOpen(false);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(caseData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseData.caseId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotice?.(`Exported ${caseData.caseId}.json`);
    setOpen(false);
  };

  const item = "w-full text-left px-3 py-2 text-body-sm flex items-center gap-2 hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More options"
        className="h-9 px-2.5 border border-rule bg-surface text-ink-muted hover:text-ink hover:bg-hover rounded-card inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1 w-56 border border-rule bg-surface rounded-card py-1">
          <button type="button" role="menuitem" className={item} onClick={copyId}>
            <Copy className="h-4 w-4 text-ink-muted" aria-hidden="true" /> Copy case ID
          </button>
          <button type="button" role="menuitem" className={item} onClick={exportJson}>
            <Download className="h-4 w-4 text-ink-muted" aria-hidden="true" /> Export as JSON
          </button>
          {!confirming ? (
            <button
              type="button"
              role="menuitem"
              className={cn(item, "text-risk-emergency")}
              disabled={!onDelete}
              title={onDelete ? undefined : "Only cases stored on the pipeline API can be deleted"}
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete case
            </button>
          ) : (
            <div className="px-3 py-2 space-y-2 border-t border-rule">
              <p className="text-body-sm text-ink">Delete {caseData.caseId} and its notes and documents? This cannot be undone.</p>
              <div className="flex gap-2">
                <button type="button" className="h-8 px-3 text-body-sm rounded-card bg-risk-emergency text-on-action disabled:opacity-60" disabled={busy} onClick={async () => { setBusy(true); try { await onDelete?.(); } finally { setBusy(false); setOpen(false); setConfirming(false); } }}>
                  {busy ? "Deleting" : "Delete"}
                </button>
                <button type="button" className="h-8 px-3 text-body-sm rounded-card border border-rule" onClick={() => setConfirming(false)}>Keep</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
