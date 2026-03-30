"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { useUser } from "@/lib/user-context";
import type { LeaveRequest } from "@/types/hr";

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = { APPROVED: "success", PENDING: "secondary", REJECTED: "destructive" };

export default function LeavesPage() {
  const { hasPermission } = useUser();
  const canEdit = hasPermission("hr", "edit");
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = useCallback(async () => { setLeaves(await (await fetch("/api/hr/leaves")).json()); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = leaves.filter(l => statusFilter === "ALL" || l.status === statusFilter);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/hr/leaves/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchData();
  }

  return (
    <div>
      <PageHeader title="Leave Management" description="Track and manage employee leave requests" />
      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Status</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="APPROVED">Approved</SelectItem><SelectItem value="REJECTED">Rejected</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Type</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead className="text-center">Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead>{canEdit && <TableHead>Actions</TableHead>}</TableRow></TableHeader>
          <TableBody>
            {filtered.map((lr) => (
              <TableRow key={lr.id}>
                <TableCell className="font-medium">{lr.employee?.firstName} {lr.employee?.lastName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{(lr.employee as any)?.department?.name || "—"}</TableCell>
                <TableCell><Badge variant="outline">{lr.leaveType}</Badge></TableCell>
                <TableCell className="text-sm">{formatDate(lr.startDate)}</TableCell>
                <TableCell className="text-sm">{formatDate(lr.endDate)}</TableCell>
                <TableCell className="text-center">{lr.days}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{lr.reason || "—"}</TableCell>
                <TableCell><Badge variant={statusVariant[lr.status]}>{lr.status}</Badge></TableCell>
                {canEdit && <TableCell>
                  {lr.status === "PENDING" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateStatus(lr.id, "APPROVED")}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 text-destructive" onClick={() => updateStatus(lr.id, "REJECTED")}>Reject</Button>
                    </div>
                  )}
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} requests</p>
    </div>
  );
}
