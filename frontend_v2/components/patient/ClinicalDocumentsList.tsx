"use client";

import React from "react";
import { FileText, Image as ImageIcon } from "lucide-react";
import { ClinicalDocument } from "@/lib/casesData";

export interface ClinicalDocumentsListProps {
  documents?: ClinicalDocument[];
}

/*
 * Documents attached at intake. Files are not retained by the API after the
 * run, so this is a record of what was submitted, not a file browser.
 */
export function ClinicalDocumentsList({ documents = [] }: ClinicalDocumentsListProps) {
  return (
    <section className="space-y-4" aria-label="Documents">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-ink">Documents ({documents.length})</h2>
        <span className="text-body-sm text-ink-muted">Attached at intake</span>
      </div>
      {documents.length === 0 ? (
        <p className="text-body-sm text-ink-muted">No documents were attached.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="text-ink-muted border-b border-rule">
                <th scope="col" className="py-2 pr-4 font-medium">Name</th>
                <th scope="col" className="py-2 pr-4 font-medium">Type</th>
                <th scope="col" className="py-2 pr-4 font-medium">Size</th>
                <th scope="col" className="py-2 font-medium">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {documents.map((doc) => (
                <tr key={doc.name}>
                  <td className="py-2.5 pr-4 text-ink">
                    <span className="inline-flex items-center gap-2">
                      {doc.type === "PDF" ? <FileText className="h-4 w-4 text-ink-muted" aria-hidden="true" /> : <ImageIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />}
                      {doc.name}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-muted">{doc.type}</td>
                  <td className="py-2.5 pr-4 text-ink-muted font-mono">{doc.size || "n/a"}</td>
                  <td className="py-2.5 text-ink-muted">{doc.uploadedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-body-sm text-ink-muted">Files are held by the API for one run and then deleted; they cannot be re-opened here.</p>
    </section>
  );
}
