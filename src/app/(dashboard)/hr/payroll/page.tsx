"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { PayrollRecord } from "@/types/hr";

const statusVariant: Record<string, "success" | "secondary" | "default"> = { PAID: "success", PROCESSED: "default", DRAFT: "secondary" };

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [monthFilter, setMonthFilter] = useState("ALL");

  useEffect(() => { fetch("/api/hr/payroll").then(r => r.json()).then(setRecords); }, []);

  const months = [...new Set(records.map(r => r.month))].sort().reverse();
  const filtered = records.filter(r => monthFilter === "ALL" || r.month === monthFilter);
  const totalNet = filtered.reduce((s, r) => s + Number(r.netPay), 0);

  return (
    <div>
      <PageHeader title="Payroll" description="Monthly payroll records and compensation" />
      <div className="flex gap-3 mb-4">
        <Select value={monthFilter} onValueChange={setMonthFilter}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Months</SelectItem>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
        <div className="ml-auto text-sm text-muted-foreground">Total Net Pay: <span className="font-mono font-bold text-foreground">{formatCurrency(totalNet)}</span></div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Month</TableHead><TableHead className="text-right">Basic</TableHead><TableHead className="text-right">Allowances</TableHead><TableHead className="text-right">Deductions</TableHead><TableHead className="text-right">Net Pay</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.employee?.firstName} {r.employee?.lastName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{(r.employee as any)?.department?.name || "—"}</TableCell>
                <TableCell className="font-mono text-sm">{r.month}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(r.basicSalary)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-600">{formatCurrency(r.allowances)}</TableCell>
                <TableCell className="text-right font-mono text-red-600">{formatCurrency(r.deductions)}</TableCell>
                <TableCell className="text-right font-mono font-medium">{formatCurrency(r.netPay)}</TableCell>
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
