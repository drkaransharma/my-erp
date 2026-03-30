"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DepartmentsTable } from "@/components/admin/departments-table";
import { DepartmentForm } from "@/components/admin/department-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Department, AdminUser } from "@/types/admin";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const fetchData = useCallback(async () => {
    const [deptsRes, usersRes] = await Promise.all([
      fetch("/api/admin/departments"), fetch("/api/admin/users"),
    ]);
    setDepartments(await deptsRes.json());
    setUsers(await usersRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Departments" description="Manage organizational departments and their leadership">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Department
        </Button>
      </PageHeader>
      <DepartmentsTable departments={departments} onEdit={(d) => { setEditing(d); setFormOpen(true); }} />
      <DepartmentForm open={formOpen} onOpenChange={setFormOpen} department={editing} users={users} onSave={fetchData} />
    </div>
  );
}
