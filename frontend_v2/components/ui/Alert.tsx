import React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string;
  message?: string;
  className?: string;
}

export function EmergencyAlert({ title, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border-l-4 border-l-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 space-y-1 animate-pulse",
        className
      )}
    >
      <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 font-bold text-base">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <span>🚨 {title}</span>
      </div>
      {message && <p className="text-xs text-red-800 dark:text-red-200 font-medium pl-7">{message}</p>}
    </div>
  );
}

export function WarningAlert({ title, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border-l-4 border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 space-y-1",
        className
      )}
    >
      <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-300 font-semibold text-sm">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <span>{title}</span>
      </div>
      {message && <p className="text-xs text-yellow-700 dark:text-yellow-400 pl-6">{message}</p>}
    </div>
  );
}

export function SuccessAlert({ title, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border-l-4 border-l-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1",
        className
      )}
    >
      <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <span>{title}</span>
      </div>
      {message && <p className="text-xs text-emerald-700 dark:text-emerald-400 pl-6">{message}</p>}
    </div>
  );
}

export function InfoAlert({ title, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border-l-4 border-l-teal-600 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1",
        className
      )}
    >
      <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-300 font-semibold text-sm">
        <Info className="h-4 w-4 text-teal-600" />
        <span>{title}</span>
      </div>
      {message && <p className="text-xs text-teal-700 dark:text-teal-400 pl-6">{message}</p>}
    </div>
  );
}
