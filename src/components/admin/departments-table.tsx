"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Department } from "@/types/admin";

interface DepartmentsTableProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
}

export function DepartmentsTable({ departments, onEdit }: DepartmentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Head</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{dept.description || "—"}</TableCell>
              <TableCell>
                {dept.head ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                      {dept.head.firstName[0]}{dept.head.lastName[0]}
                    </div>
                    <span className="text-sm">{dept.head.firstName} {dept.head.lastName}</span>
                  </div>
                ) : <span className="text-sm text-muted-foreground">Not assigned</span>}
              </TableCell>
              <TableCell className="text-center"><Badge variant="secondary">{dept._count?.users ?? 0}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="icon" onClick={() => onEdit(dept)}><Pencil className="h-4 w-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
