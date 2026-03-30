"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { AttendanceRecord } from "@/types/hr";

const statusVariant: Record<string, "success" | "secondary" | "destructive" | "warning"> = { PRESENT: "success", ABSENT: "destructive", LATE: "warning", LEAVE: "secondary" };

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetch("/api/hr/attendance").then(r => r.json()).then(setRecords); }, []);

  const filtered = records.filter(r => {
    const name = `${r.employee?.firstName} ${r.employee?.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader title="Attendance" description="Daily attendance tracking for all employees" />
      <div className="relative max-w-sm mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Date</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead className="text-right">Hours</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 100).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.employee?.firstName} {r.employee?.lastName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{(r.employee as any)?.department?.name || "—"}</TableCell>
                <TableCell className="text-sm">{formatDate(r.date)}</TableCell>
                <TableCell className="text-sm font-mono">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                <TableCell className="text-sm font-mono">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                <TableCell className="text-right font-mono">{r.hoursWorked ? Number(r.hoursWorked).toFixed(1) : "—"}</TableCell>
                <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} records</p>
    </div>
  );
}
