export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/finance/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Building2, Shield } from "lucide-react";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [totalUsers, activeUsers, deptCount, roleCount, departments, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.department.count(),
    prisma.role.count(),
    prisma.department.findMany({ include: { _count: { select: { users: true } } }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { lastLoginAt: "desc" }, take: 5, include: { role: true, department: true } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="User management and organizational overview" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={String(totalUsers)} icon={Users} />
        <KpiCard title="Active Users" value={String(activeUsers)} icon={UserCheck} iconColor="text-emerald-600" />
        <KpiCard title="Departments" value={String(deptCount)} icon={Building2} />
        <KpiCard title="Roles" value={String(roleCount)} icon={Shield} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Department Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.map((dept) => {
                const pct = totalUsers > 0 ? (dept._count.users / totalUsers) * 100 : 0;
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-muted-foreground">{dept._count.users} users</span>
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

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.department?.name || "No dept"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">{user.role?.name || "No role"}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
