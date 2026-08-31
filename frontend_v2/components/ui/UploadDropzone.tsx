"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, X } from "lucide-react";
import { formatFileSize } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMb?: number;
  className?: string;
}

export function MedicalUploadDropzone({
  onFileSelect,
  acceptedTypes = [".pdf", ".png", ".jpg", ".jpeg"],
  maxSizeMb = 25,
  className,
}: UploadDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File exceeds maximum allowed size of ${maxSizeMb}MB.`);
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
      className={cn(
        "relative cursor-pointer rounded-card border-2 border-dashed border-rule-strong bg-surface p-6 text-center transition-colors hover:border-action hover:bg-action-subtle",
        // Drag-active reads as a distinct state, not a stronger hover: the
        // dashed border goes solid as well as changing colour, so the cue
        // survives for anyone who cannot separate the two hues.
        dragActive && "border-solid border-action bg-action-subtle",
        className
      )}
    >
      <input
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between rounded-control border border-rule bg-surface-raised p-3">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 shrink-0 text-action" aria-hidden="true" />
            <div className="text-left">
              <p className="max-w-[200px] truncate text-body-sm font-semibold text-ink">
                {selectedFile.name}
              </p>
              <p className="text-body-sm text-ink-muted">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            aria-label={`Remove ${selectedFile.name}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-rule hover:text-risk-emergency"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <UploadCloud className="mb-1 h-10 w-10 text-action" aria-hidden="true" />
          <p className="text-body-sm font-semibold text-ink">
            Click to upload or drag medical report / image here
          </p>
          <p className="text-body-sm text-ink-muted">
            Supports PDF, PNG, JPG (Up to {maxSizeMb}MB)
          </p>
        </div>
      )}
    </div>
  );
}
