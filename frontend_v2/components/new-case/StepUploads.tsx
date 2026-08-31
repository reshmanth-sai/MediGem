"use client";

import React, { useState } from "react";
import { FileText, FileImage, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MedicalUploadDropzone } from "@/components/ui/UploadDropzone";
import { H3, BodySm, Label } from "@/components/ui/Typography";
import { formatFileSize } from "@/lib/formatters";

export interface UploadedFileItem {
  id: string;
  file: File;
  type: string;
}

const CATEGORIES = [
  { id: "LAB_REPORT", label: "Lab report PDF" },
  { id: "ECG", label: "ECG rhythm strip" },
  { id: "PRESCRIPTION", label: "Prescription memo" },
  { id: "WOUND", label: "Wound image" },
];

export function StepUploads({
  uploadedFiles,
  onAddFile,
  onRemoveFile,
}: {
  uploadedFiles: UploadedFileItem[];
  onAddFile: (file: File, type: string) => void;
  onRemoveFile: (id: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

  return (
    <Card className="space-y-6">
      <div className="space-y-1">
        <H3>Step 4: Medical file and document workspace</H3>
        <BodySm className="text-ink-muted">
          Attach laboratory PDFs, 12-lead ECG rhythm strips, prescription memos,
          or wound images.
        </BodySm>
      </div>

      <fieldset className="space-y-2 border-0 p-0 m-0">
        <legend className="text-label text-ink">Document classification</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-control text-body-sm font-semibold border transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                selectedCategory === cat.id
                  ? "bg-action text-on-action border-action"
                  : "bg-surface-raised text-ink border-rule hover:border-rule-strong"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </fieldset>

      <MedicalUploadDropzone
        onFileSelect={(file) => onAddFile(file, selectedCategory)}
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <Label as="h4">Uploaded files ({uploadedFiles.length})</Label>
          <ul className="space-y-2 list-none p-0 m-0">
            {uploadedFiles.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 bg-surface-raised border border-rule rounded-control"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.file.type.includes("pdf") ? (
                    <FileText
                      className="h-5 w-5 text-ink-muted shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <FileImage
                      className="h-5 w-5 text-ink-muted shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-ink break-all">
                      {item.file.name}
                    </p>
                    <p className="text-body-sm text-ink-muted">
                      {formatFileSize(item.file.size)}, {item.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-risk-low">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Ready
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${item.file.name}`}
                    onClick={() => onRemoveFile(item.id)}
                    className="p-2 rounded-control text-ink-muted hover:text-risk-emergency focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
