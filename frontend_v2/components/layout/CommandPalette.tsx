import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Activity, History, FileText, Award, Terminal, Settings, User, BookOpen } from "lucide-react";
import { ModalDialog } from "@/components/ui/Dialog";
import { PRESET_CASES } from "@/lib/casesData";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { label: "New Patient Case Intake", path: "/new-case", icon: <Activity className="h-4 w-4 text-teal-400" />, type: "Page" },
    { label: "Learning & Knowledge Hub", path: "/learning", icon: <BookOpen className="h-4 w-4 text-teal-400" />, type: "Page" },
    { label: "Patient Queue & History", path: "/history", icon: <History className="h-4 w-4 text-teal-400" />, type: "Page" },
    { label: "Synthetic Demo Presets", path: "/demo", icon: <FileText className="h-4 w-4 text-emerald-400" />, type: "Page" },
    { label: "Evaluation Benchmarks", path: "/evaluation", icon: <Award className="h-4 w-4 text-amber-400" />, type: "Page" },
    { label: "Developer Inspector", path: "/developer", icon: <Terminal className="h-4 w-4 text-purple-400" />, type: "Page" },
    { label: "Settings & Config", path: "/settings", icon: <Settings className="h-4 w-4 text-slate-400" />, type: "Page" },
  ];

  // Map patient cases to command items
  const patientCommands = Object.values(PRESET_CASES).map((p) => ({
    label: `${p.patientName} (${p.patientId}) — ${p.village || "Rural Clinic"} — ${p.riskLevel} RISK`,
    path: `/results/${p.caseId}`,
    icon: <User className="h-4 w-4 text-teal-400" />,
    type: "Patient Record",
  }));

  const allItems = [...commands, ...patientCommands];

  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = (path: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(path);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="⌘K Global Command & Patient Search">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, ID, village, symptom, or page..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-xl placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-72 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-teal-300 rounded-xl transition-colors text-left font-medium group"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                  {item.type}
                </span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-400 p-3 text-center">No matching patients or commands found.</p>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
