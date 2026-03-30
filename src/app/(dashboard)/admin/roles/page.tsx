"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { RolesTable } from "@/components/admin/roles-table";
import { RoleForm } from "@/components/admin/role-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Role } from "@/types/admin";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/roles");
    setRoles(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Manage roles and their module-level access permissions">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Role
        </Button>
      </PageHeader>
      <RolesTable roles={roles} onEdit={(r) => { setEditing(r); setFormOpen(true); }} />
      <RoleForm open={formOpen} onOpenChange={setFormOpen} role={editing} onSave={fetchData} />
    </div>
  );
}
