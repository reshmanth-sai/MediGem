import React from "react";
import { HardDrive, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function OfflineSettings() {
  return (
    <Card className="space-y-3">
      <div className="flex items-center space-x-2">
        <HardDrive className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Local SQLite & Cache Storage Settings
          </h3>
          <p className="text-xs text-slate-500">
            Manage local storage quota and offline patient case cache
          </p>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
        <div className="flex justify-between font-bold text-slate-900 dark:text-white">
          <span>Local Cache Usage</span>
          <span>4.2 MB / 50.0 MB</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-600 w-[8.4%]" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-500">128 Patient Cases Saved Locally</span>
        <Button size="sm" variant="outline" leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
          Clear Cache
        </Button>
      </div>
    </Card>
  );
}
