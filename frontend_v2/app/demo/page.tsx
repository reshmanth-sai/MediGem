import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DemoPage() {
  const presets = [
    { title: "Lab Report PDF", desc: "Complete blood count with elevated WBC", type: "PDF" },
    { title: "ECG Rhythm Strip", desc: "12-Lead ECG showing sinus tachycardia", type: "PNG" },
    { title: "Prescription Scan", desc: "Handwritten rural prescription memo", type: "PNG" },
    { title: "Wound Clinical Image", desc: "Post-operative surgical wound monitoring", type: "JPG" },
  ];

  return (
    <AppShell>
      <DashboardTemplate title="Synthetic Demo Presets Gallery" subtitle="1-Click synthetic clinical preset loaders">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presets.map((p) => (
            <Card key={p.title} className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h4>
              <p className="text-xs text-slate-500">{p.desc}</p>
              <Button size="sm" variant="secondary">
                Load Preset
              </Button>
            </Card>
          ))}
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
