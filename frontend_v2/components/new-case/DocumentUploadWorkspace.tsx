"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  FileCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { H3, BodySm, Label } from "@/components/ui/Typography";
import { formatFileSize } from "@/lib/formatters";
import { UploadedFileItem } from "./StepUploads";

export interface DocumentUploadWorkspaceProps {
  uploadedFiles: UploadedFileItem[];
  onAddFile: (file: File, type: string) => void;
  onRemoveFile: (id: string) => void;
}

const CATEGORIES = [
  { id: "Lab Report PDF", icon: FileText, desc: "CBC, lipid, metabolic panels" },
  { id: "ECG Rhythm Strip", icon: Activity, desc: "12-lead rhythm scans" },
  { id: "Prescription Memo", icon: FileCheck, desc: "Handwritten prescriptions" },
  { id: "Wound Image", icon: ImageIcon, desc: "Surgical or skin photographs" },
];

export function DocumentUploadWorkspace({
  uploadedFiles,
  onAddFile,
  onRemoveFile,
}: DocumentUploadWorkspaceProps) {
  const [docCategory, setDocCategory] = useState(CATEGORIES[0].id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddFile(file, docCategory);
      // Clear the control so the same file can be attached twice if needed.
      e.target.value = "";
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-rule">
        <span className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <FileText className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <H3>Step 4: Clinical documents and medical uploads</H3>
          <BodySm className="text-ink-muted">
            Attach laboratory PDFs, 12-lead ECG rhythm strips, prescriptions, or
            wound photographs. This step is optional.
          </BodySm>
        </div>
      </div>

      <fieldset className="space-y-2 border-0 p-0 m-0">
        <legend className="text-label text-ink">Document classification</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = docCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setDocCategory(cat.id)}
                className={`p-3 rounded-control border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  isActive
                    ? "bg-action-subtle border-action text-ink"
                    : "bg-surface-raised border-rule text-ink-muted hover:border-rule-strong"
                }`}
              >
                <Icon className="h-4 w-4 mb-1 text-action" aria-hidden="true" />
                <span className="block text-body-sm font-semibold text-ink">
                  {cat.id}
                </span>
                <span className="block text-body-sm text-ink-muted">
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="rounded-card border border-dashed border-rule-strong bg-surface-raised p-6">
        <Field
          id="caseDocument"
          label="Attach a document"
          helper={`Saved as ${docCategory}. PDF, PNG or JPG, up to 25 MB.`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="block w-full text-body-sm text-ink file:mr-3 file:h-11 file:rounded-control file:border file:border-rule file:bg-action file:px-4 file:text-body-sm file:font-semibold file:text-on-action hover:file:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </Field>
        <p className="mt-3 flex items-center gap-2 text-body-sm text-ink-muted">
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>Files stay on this device. Nothing is uploaded off the edge node.</span>
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label as="p">Attached files ({uploadedFiles.length})</Label>
          <ul className="space-y-2 list-none p-0 m-0">
            {uploadedFiles.map((item) => (
              <li
                key={item.id}
                className="p-3 rounded-control bg-surface-raised border border-rule flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2
                    className="h-4 w-4 text-risk-low shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-ink break-all">
                      {item.file.name}
                    </p>
                    <p className="text-body-sm text-ink-muted">
                      {item.type}, {formatFileSize(item.file.size)}, ready
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="p-2 rounded-control text-ink-muted hover:text-risk-emergency hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
