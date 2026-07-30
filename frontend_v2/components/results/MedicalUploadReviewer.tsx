"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function MedicalUploadReviewer() {
  const [activeFile, setActiveFile] = useState("Lab_Report_CBC.pdf");

  const files = [
    { name: "Lab_Report_CBC.pdf", type: "PDF", size: "1.2 MB", date: "2026-07-30" },
    { name: "ECG_Rhythm_Strip.png", type: "PNG", size: "850 KB", date: "2026-07-30" },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-600" />
          <span>Medical Upload Reviewer & Preview</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">PyMuPDF Text Layer Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* File List */}
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.name}
              onClick={() => setActiveFile(f.name)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                activeFile === f.name
                  ? "bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-200 font-bold"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <p className="truncate">{f.name}</p>
              <p className="text-[11px] text-slate-400 font-normal">{f.size} • {f.type}</p>
            </div>
          ))}
        </div>

        {/* File Preview Area */}
        <div className="md:col-span-2 p-6 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-3 min-h-[180px]">
          <Eye className="h-8 w-8 text-teal-400" />
          <p className="text-xs font-mono font-semibold">{activeFile}</p>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="border-slate-700 text-white text-xs" leftIcon={<Maximize2 className="h-3.5 w-3.5" />}>
              Fullscreen
            </Button>
            <Button size="sm" variant="primary" className="text-xs" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
