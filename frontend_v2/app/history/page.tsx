import { AppShell } from "@/components/layout/AppShell";
import { HistoryTemplate } from "@/components/templates/Templates";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";

export default function HistoryPage() {
  const sessions = [
    { id: "CASE-001", patient: "P-101", date: "2026-07-30 12:00", risk: "MODERATE" },
    { id: "CASE-002", patient: "P-102", date: "2026-07-30 11:30", risk: "EMERGENCY" },
    { id: "CASE-003", patient: "P-103", date: "2026-07-30 10:15", risk: "LOW" },
  ];

  return (
    <AppShell>
      <HistoryTemplate title="Session Case History">
        {sessions.map((sess) => (
          <Card key={sess.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{sess.id} ({sess.patient})</p>
              <p className="text-xs text-slate-500">{sess.date}</p>
            </div>
            <RiskBadge level={sess.risk as any} />
          </Card>
        ))}
      </HistoryTemplate>
    </AppShell>
  );
}
