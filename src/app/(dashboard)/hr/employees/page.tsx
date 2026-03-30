"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useUser } from "@/lib/user-context";
import type { Employee } from "@/types/hr";

const statusVariant: Record<string, "success" | "warning" | "destructive"> = { ACTIVE: "success", ON_LEAVE: "warning", TERMINATED: "destructive" };

export default function EmployeesPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("hr", "create");
  const canEdit = hasPermission("hr", "edit");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/hr/employees");
    setEmployees(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = employees.filter((e) => {
    const name = `${e.firstName} ${e.lastName}`.toLowerCase();
    return (name.includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "ALL" || e.status === statusFilter);
  });

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = { firstName: fd.get("firstName"), lastName: fd.get("lastName"), email: fd.get("email"), phone: fd.get("phone") || null, position: fd.get("position"), departmentId: fd.get("departmentId") || null, status: fd.get("status"), joinDate: fd.get("joinDate"), salary: parseFloat(fd.get("salary") as string) || 0 };
    await fetch(editing ? `/api/hr/employees/${editing.id}` : "/api/hr/employees", {
      method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    setFormOpen(false);
    fetchData();
  }

  return (
    <div>
      <PageHeader title="Employees" description="Manage employee records">
        {canCreate && <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Employee</Button>}
      </PageHeader>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Status</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="ON_LEAVE">On Leave</SelectItem><SelectItem value="TERMINATED">Terminated</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Email</TableHead><TableHead>Position</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Salary</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="w-[60px]"></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">{emp.firstName[0]}{emp.lastName[0]}</div><div><span className="font-medium">{emp.firstName} {emp.lastName}</span><p className="text-[10px] text-muted-foreground">{emp.employeeCode}</p></div></div></TableCell>
                <TableCell className="text-sm">{emp.email}</TableCell>
                <TableCell className="text-sm">{emp.position}</TableCell>
                <TableCell className="text-sm">{emp.department?.name || "—"}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(emp.salary)}</TableCell>
                <TableCell><Badge variant={statusVariant[emp.status]}>{emp.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-sm">{formatDate(emp.joinDate)}</TableCell>
                <TableCell>{canEdit && <Button variant="ghost" size="icon" onClick={() => { setEditing(emp); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} employees</p>

      {(canCreate || canEdit) && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>First Name *</Label><Input name="firstName" defaultValue={editing?.firstName ?? ""} required /></div><div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" defaultValue={editing?.lastName ?? ""} required /></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" defaultValue={editing?.email ?? ""} required /></div><div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={editing?.phone ?? ""} /></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Position *</Label><Input name="position" defaultValue={editing?.position ?? ""} required /></div><div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status ?? "ACTIVE"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="ON_LEAVE">On Leave</SelectItem><SelectItem value="TERMINATED">Terminated</SelectItem></SelectContent></Select></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Join Date</Label><Input name="joinDate" type="date" defaultValue={editing ? new Date(editing.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]} /></div><div className="space-y-2"><Label>Annual Salary ($)</Label><Input name="salary" type="number" defaultValue={editing?.salary ?? ""} /></div></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
