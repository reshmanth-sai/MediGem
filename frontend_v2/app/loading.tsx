export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading MediGem Clinical Co-Pilot...
        </p>
      </div>
    </div>
  );
}
