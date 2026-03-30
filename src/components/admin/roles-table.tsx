"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Lock } from "lucide-react";
import type { Role, ModuleName } from "@/types/admin";

const moduleNames: ModuleName[] = ["finance", "crm", "hr", "inventory", "admin"];

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

export function RolesTable({ roles, onEdit }: RolesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const perms = role.permissions as Record<string, any> || {};
            const enabledModules = moduleNames.filter((m) => perms[m]?.view);
            return (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{role.name}</span>
                    {role.isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{role.description || "—"}</TableCell>
                <TableCell><Badge variant="secondary">{role._count?.users ?? 0}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {enabledModules.map((m) => {
                      const hasWrite = perms[m]?.create || perms[m]?.edit || perms[m]?.delete;
                      return (
                        <Badge key={m} variant={hasWrite ? "default" : "outline"} className="text-[10px] capitalize">
                          {m}
                        </Badge>
                      );
                    })}
                    {enabledModules.length === 0 && <span className="text-xs text-muted-foreground">No access</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(role)}><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
