"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionsMatrix } from "@/components/admin/permissions-matrix";
import type { Role, PermissionsMap } from "@/types/admin";

const defaultPerms: PermissionsMap = {
  finance: { view: false, create: false, edit: false, delete: false },
  crm: { view: false, create: false, edit: false, delete: false },
  hr: { view: false, create: false, edit: false, delete: false },
  inventory: { view: false, create: false, edit: false, delete: false },
  admin: { view: false, create: false, edit: false, delete: false },
};

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSave: () => void;
}

export function RoleForm({ open, onOpenChange, role, onSave }: RoleFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState<PermissionsMap>(
    (role?.permissions as PermissionsMap) || defaultPerms
  );
  const isEditing = !!role;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: (fd.get("description") as string) || null,
      permissions,
    };
    try {
      const res = await fetch(isEditing ? `/api/admin/roles/${role.id}` : "/api/admin/roles", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      onSave();
      onOpenChange(false);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (o && role) setPermissions((role.permissions as PermissionsMap) || defaultPerms); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{isEditing ? "Edit Role" : "Add Role"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role Name *</Label>
              <Input name="name" defaultValue={role?.name ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input name="description" defaultValue={role?.description ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Module Permissions</Label>
            <PermissionsMatrix value={permissions} onChange={setPermissions} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
