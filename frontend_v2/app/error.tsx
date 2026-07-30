"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary intercepted crash:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full medigem-card p-6 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Application Error Detected
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {error.message || "An unexpected error occurred in the clinical application layer."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-teal-600 text-white rounded-md font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
