"use client";

import React, { useState } from "react";
import { FileText, FileImage, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MedicalUploadDropzone } from "@/components/ui/UploadDropzone";
import { formatFileSize } from "@/lib/formatters";

export interface UploadedFileItem {
  id: string;
  file: File;
  type: string;
}

export function StepUploads({
  uploadedFiles,
  onAddFile,
  onRemoveFile,
}: {
  uploadedFiles: UploadedFileItem[];
  onAddFile: (file: File, type: string) => void;
  onRemoveFile: (id: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("LAB_REPORT");

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step 4: Medical File & Document Workspace
        </h3>
        <p className="text-xs text-slate-500">
          Upload PDF laboratory reports, 12-lead ECG rhythm strips, prescription memos, or wound images
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Select Document Classification
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "LAB_REPORT", label: "Lab Report PDF" },
            { id: "ECG", label: "ECG Rhythm Strip" },
            { id: "PRESCRIPTION", label: "Prescription Memo" },
            { id: "WOUND", label: "Wound Image" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                selectedCategory === cat.id
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <MedicalUploadDropzone
        onFileSelect={(file) => onAddFile(file, selectedCategory)}
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              >
                <div className="flex items-center space-x-3">
                  {item.file.type.includes("pdf") ? (
                    <FileText className="h-5 w-5 text-red-500 shrink-0" />
                  ) : (
                    <FileImage className="h-5 w-5 text-teal-600 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.file.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {formatFileSize(item.file.size)} • Type: {item.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Ready
                  </span>
                  <button
                    onClick={() => onRemoveFile(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
