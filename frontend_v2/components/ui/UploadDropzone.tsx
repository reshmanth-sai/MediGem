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
        "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-slate-800",
        dragActive && "border-teal-600 bg-teal-50 dark:bg-slate-800",
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
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <UploadCloud className="h-10 w-10 text-teal-600 dark:text-teal-400 mb-1" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Click to upload or drag medical report / image here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports PDF, PNG, JPG (Up to {maxSizeMb}MB)
          </p>
        </div>
      )}
    </div>
  );
}
