"use client";

import React, { useState } from "react";
import { Download, FileText, CheckCircle2, Archive } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ExportCenter() {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleBatchExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 4000);
    }, 1200);
  };

  return (
    <Card className="space-y-4 border-l-4 border-l-teal-600 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Archive className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            📦 Batch Case Export Center & Local Backup
          </h3>
        </div>
        <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
          LOCAL BATCH ACTIVE
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300">
        Export selected patient cases, clinical referral memorandums, and telemetry in JSON or PDF archive format.
      </p>

      <div className="flex items-center space-x-3">
        <Button
          size="sm"
          variant="primary"
          leftIcon={exported ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Download className="h-4 w-4" />}
          onClick={handleBatchExport}
        >
          {isExporting ? "Generating Batch Archive..." : exported ? "Batch Archive Ready (.zip)" : "Export All Selected Cases"}
        </Button>
        <span className="text-xs text-slate-400">4 Cases Selected for Batch Export</span>
      </div>
    </Card>
  );
}
