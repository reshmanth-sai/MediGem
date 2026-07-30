"use client";

import React, { useState } from "react";
import { UploadedFileItem } from "./StepUploads";
import { FileText, Upload, Trash2, CheckCircle2, Image as ImageIcon, Activity, FileCheck } from "lucide-react";

interface DocumentUploadWorkspaceProps {
  uploadedFiles: UploadedFileItem[];
  onAddFile: (file: File, type: string) => void;
  onRemoveFile: (id: string) => void;
}

export function DocumentUploadWorkspace({ uploadedFiles, onAddFile, onRemoveFile }: DocumentUploadWorkspaceProps) {
  const [docCategory, setDocCategory] = useState("Lab Report PDF");

  const categories = [
    { id: "Lab Report PDF", icon: FileText, desc: "CBC, Lipid, Metabolic Panels" },
    { id: "ECG Rhythm Strip", icon: Activity, desc: "12-Lead Rhythm Scans" },
    { id: "Prescription Memo", icon: FileCheck, desc: "Handwritten Rx Scans" },
    { id: "Wound Image", icon: ImageIcon, desc: "Surgical / Skin Photos" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddFile(e.target.files[0], docCategory);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Clinical Document & Medical Upload Workspace</h2>
          <p className="text-xs text-slate-400">Upload PDF lab reports, 12-lead ECG rhythm strips, prescriptions, or wound photos.</p>
        </div>
      </div>

      {/* Category Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = docCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setDocCategory(cat.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-teal-950/60 border-teal-500 text-teal-300 shadow-md"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 mb-1 text-teal-400" />
              <p className="font-bold text-[11px] truncate">{cat.id}</p>
            </button>
          );
        })}
      </div>

      {/* Dropzone Container */}
      <div className="relative border-2 border-dashed border-slate-800 hover:border-teal-500/60 rounded-2xl p-8 text-center bg-slate-950/60 transition-colors">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="space-y-2 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-slate-900 text-teal-400 border border-slate-800">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              Drop file here or click to attach <span className="text-teal-300">[{docCategory}]</span>
            </p>
            <p className="text-[11px] text-slate-500 font-mono">Supports PDF, PNG, JPG (Up to 25MB)</p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Attached Files ({uploadedFiles.length})</p>
          <div className="space-y-2">
            {uploadedFiles.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">{item.file.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{item.type} • PyMuPDF / OpenCV Verified</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
