export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { KpiCard } from "@/components/finance/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Clock, Briefcase } from "lucide-react";

export default async function HRDashboardPage() {
  const [totalEmps, activeEmps, onLeave, pendingLeaves, recentLeaves, deptCounts] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.employee.count({ where: { status: "ON_LEAVE" } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.leaveRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { employee: { include: { department: true } } } }),
    prisma.employee.groupBy({ by: ["departmentId"], _count: true, where: { status: { not: "TERMINATED" } } }),
  ]);

  const departments = await prisma.department.findMany();
  const deptMap = Object.fromEntries(departments.map(d => [d.id, d.name]));

  const totalPayroll = await prisma.payrollRecord.aggregate({ where: { month: "2026-03" }, _sum: { netPay: true } });

  return (
    <div className="space-y-6">
      <PageHeader title="HR Dashboard" description="Human resources overview and workforce metrics" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Employees" value={String(totalEmps)} icon={Users} />
        <KpiCard title="Active" value={String(activeEmps)} icon={UserCheck} iconColor="text-emerald-600" />
        <KpiCard title="On Leave" value={String(onLeave)} icon={Clock} iconColor="text-amber-600" />
        <KpiCard title="Pending Leave Requests" value={String(pendingLeaves)} icon={Briefcase} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Headcount by Department</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deptCounts.map((dc) => {
                const pct = totalEmps > 0 ? (dc._count / totalEmps) * 100 : 0;
                return (
                  <div key={dc.departmentId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{deptMap[dc.departmentId!] || "Unassigned"}</span>
                      <span className="text-muted-foreground">{dc._count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Recent Leave Requests</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeaves.map((lr) => (
                <div key={lr.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{lr.employee.firstName} {lr.employee.lastName}</p>
                    <p className="text-xs text-muted-foreground">{lr.leaveType} &middot; {lr.days} days</p>
                  </div>
                  <Badge variant={lr.status === "APPROVED" ? "success" : lr.status === "REJECTED" ? "destructive" : "secondary"}>{lr.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Monthly Payroll (March 2026)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(Number(totalPayroll._sum.netPay || 0))}</p>
          <p className="text-sm text-muted-foreground mt-1">{activeEmps} active employees</p>
        </CardContent>
      </Card>
    </div>
  );
}
