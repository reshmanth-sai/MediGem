"use client";

import React, { useState } from "react";
import { FileText, Image as ImageIcon, Plus, MoreVertical } from "lucide-react";
import { ClinicalDocument } from "@/lib/casesData";

export interface ClinicalDocumentsListProps {
  documents?: ClinicalDocument[];
  onUploadFile?: (file: File) => void;
}

export function ClinicalDocumentsList({
  documents = [
    { name: "chest_xray.jpg", type: "Image", size: "2.1 MB", uploadedTime: "Today, 10:12 AM" },
    { name: "lab_report.pdf", type: "PDF", size: "1.4 MB", uploadedTime: "Today, 10:10 AM" },
    { name: "prescription.jpg", type: "Image", size: "512 KB", uploadedTime: "Today, 10:08 AM" },
  ],
  onUploadFile,
}: ClinicalDocumentsListProps) {
  const [docList, setDocList] = useState<ClinicalDocument[]>(documents);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: ClinicalDocument = {
        name: file.name,
        type: file.name.endsWith(".pdf") ? "PDF" : "Image",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedTime: "Today, Just now",
      };
      setDocList((prev) => [newDoc, ...prev]);
      onUploadFile?.(file);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Uploaded Documents ({docList.length})
        </h2>
        <label className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Add file</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Structured Document Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-medium">
              <th className="py-2.5 pl-0 pr-4 font-normal">Name</th>
              <th className="py-2.5 px-4 font-normal">Type</th>
              <th className="py-2.5 px-4 font-normal">Size</th>
              <th className="py-2.5 px-4 font-normal">Uploaded</th>
              <th className="py-2.5 pl-4 pr-1 text-right font-normal"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docList.map((doc) => {
              const isPdf = doc.type.toLowerCase().includes("pdf") || doc.name.endsWith(".pdf");
              return (
                <tr key={doc.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-0 pr-4">
                    <div className="flex items-center gap-3">
                      {isPdf ? (
                        <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                          <FileText className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.type}</td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.size}</td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.uploadedTime}</td>
                  <td className="py-3.5 pl-4 pr-1 text-right">
                    <button
                      type="button"
                      aria-label={`Options for ${doc.name}`}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
