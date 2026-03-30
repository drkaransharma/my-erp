"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/admin/users-table";
import { UserForm } from "@/components/admin/user-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AdminUser, Role, Department } from "@/types/admin";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const fetchData = useCallback(async () => {
    const [usersRes, rolesRes, deptsRes] = await Promise.all([
      fetch("/api/admin/users"), fetch("/api/admin/roles"), fetch("/api/admin/departments"),
    ]);
    setUsers(await usersRes.json());
    setRoles(await rolesRes.json());
    setDepartments(await deptsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts, roles, and department assignments">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add User
        </Button>
      </PageHeader>
      <UsersTable users={users} roles={roles} departments={departments} onEdit={(u) => { setEditing(u); setFormOpen(true); }} />
      <UserForm open={formOpen} onOpenChange={setFormOpen} user={editing} roles={roles} departments={departments} users={users} onSave={fetchData} />
    </div>
  );
}
