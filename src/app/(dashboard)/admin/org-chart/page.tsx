"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { OrgChartTree } from "@/components/admin/org-chart-tree";
import type { AdminUser } from "@/types/admin";

export default function OrgChartPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }, []);

  const activeUsers = users.filter((u) => u.status === "ACTIVE");

  return (
    <div>
      <PageHeader title="Organization Chart" description="Visual hierarchy of your organization's reporting structure" />
      <OrgChartTree users={activeUsers} />
    </div>
  );
}
