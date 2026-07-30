import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Settings & Configurations" subtitle="Model endpoints, local storage, and clinic parameters">
        <Card className="max-w-xl space-y-4">
          <TextField label="Ollama Service Endpoint" defaultValue="http://localhost:11434" />
          <TextField label="FastAPI Backend REST URL" defaultValue="http://localhost:8000/api/v1" />
          <TextField label="Default Gemma Model" defaultValue="gemma3:4b" readOnly />
          <Button variant="primary">Save Settings</Button>
        </Card>
      </DashboardTemplate>
    </AppShell>
  );
}
