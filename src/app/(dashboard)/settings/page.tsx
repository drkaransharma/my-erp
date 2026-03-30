import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Platform configuration and preferences" />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Settings className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Settings Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Platform settings including SAP/Oracle connector configuration, user management,
            and system preferences will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
