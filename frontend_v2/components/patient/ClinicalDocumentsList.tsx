"use client";

import React, { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Plus, ExternalLink } from "lucide-react";
import { ClinicalDocument } from "@/lib/casesData";

export interface ClinicalDocumentsListProps {
  documents?: ClinicalDocument[];
  /** Present when the case is stored on the API; uploads and attaches a file. */
  onAddFile?: (file: File) => Promise<void>;
}

/*
 * Intake uploads are listed by name only (the API holds them for one run).
 * Files attached afterwards are stored by the API and open in a new tab.
 */
export function ClinicalDocumentsList({ documents = [], onAddFile }: ClinicalDocumentsListProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onAddFile) return;
    setBusy(true);
    setError(null);
    try {
      await onAddFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The file could not be attached.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4" aria-label="Documents">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h3 text-ink">Documents ({documents.length})</h2>
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={!onAddFile || busy}
          title={onAddFile ? "PNG, JPEG, WebP or PDF up to the API's size limit" : "Files can be attached to cases stored on the pipeline API"}
          className="text-body-sm font-medium text-action hover:underline inline-flex items-center gap-1 disabled:text-ink-subtle disabled:no-underline disabled:cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> {busy ? "Attaching" : "Attach file"}
        </button>
        <input ref={input} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={pick} aria-label="Attach file" />
      </div>
      {error && <p role="alert" className="text-body-sm text-risk-emergency">{error}</p>}
      {documents.length === 0 ? (
        <p className="text-body-sm text-ink-muted">No documents on this case.</p>
      ) : (
        // Focusable because it scrolls: the table inside overruns a narrow
        // phone, and a scroll region a keyboard cannot reach is WCAG 2.1.1
        // (axe scrollable-region-focusable). The label names the tab stop.
        <div className="overflow-x-auto" tabIndex={0} role="group" aria-label="Documents, scrollable">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="text-ink-muted border-b border-rule">
                <th scope="col" className="py-2 pr-4 font-medium">Name</th>
                <th scope="col" className="py-2 pr-4 font-medium">Type</th>
                <th scope="col" className="py-2 pr-4 font-medium">Size</th>
                <th scope="col" className="py-2 pr-4 font-medium">Added</th>
                <th scope="col" className="py-2 font-medium">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {documents.map((doc) => (
                <tr key={doc.id ?? doc.name}>
                  <td className="py-2.5 pr-4 text-ink">
                    <span className="inline-flex items-center gap-2">
                      {doc.type === "PDF" ? <FileText className="h-4 w-4 text-ink-muted" aria-hidden="true" /> : <ImageIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />}
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-action hover:underline inline-flex items-center gap-1">
                          {doc.name} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : (
                        doc.name
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-muted">{doc.type}</td>
                  <td className="py-2.5 pr-4 text-ink-muted font-mono">{doc.size || "n/a"}</td>
                  <td className="py-2.5 pr-4 text-ink-muted">{doc.uploadedTime}</td>
                  <td className="py-2.5 text-ink-muted">{doc.addedBy ?? "intake"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-body-sm text-ink-muted">Intake uploads are processed and then discarded, so they are listed by name only. Files attached here are kept with the case.</p>
    </section>
  );
}
