import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full medigem-card p-6 text-center space-y-4">
        <div className="text-4xl">💎</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">404 - Page Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The clinical workspace page you requested does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-teal-600 text-white rounded-md font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
