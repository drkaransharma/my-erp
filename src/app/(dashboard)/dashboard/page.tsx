"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { TaskList } from "@/components/dashboard/task-list";
import { KpiCard } from "@/components/finance/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { DollarSign, TrendingUp, Users, Handshake, Package, UserCheck, Receipt, Target } from "lucide-react";
import type { GeneratedTask } from "@/lib/task-generator";

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  cashBalance: number;
  activeDeals: number;
  pipelineValue: number;
  totalLeads: number;
  totalContacts: number;
  overdueBills: number;
  overdueInvoices: number;
}

export default function DashboardPage() {
  const { currentUser, loading: userLoading } = useUser();
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/tasks?userId=${currentUser.id}`).then((r) => r.json()),
      fetch("/api/reports?type=pnl").then((r) => r.json()),
    ]).then(([tasksData, pnlData]) => {
      setTasks(tasksData);
      setStats({
        totalRevenue: pnlData.totalRevenue || 0,
        totalExpenses: pnlData.totalExpenses || 0,
        netIncome: pnlData.netIncome || 0,
        cashBalance: 284500,
        activeDeals: 0,
        pipelineValue: 0,
        totalLeads: 0,
        totalContacts: 0,
        overdueBills: 0,
        overdueInvoices: 0,
      });
      setLoading(false);
    });
  }, [currentUser]);

  if (userLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const deptName = currentUser.department?.name || "";
  const isExecutive = deptName === "Executive" || currentUser.role?.name === "Super Admin";
  const isFinance = deptName === "Finance" || (currentUser.role?.name || "").includes("Finance");
  const isCRM = deptName.includes("Sales") || deptName.includes("CRM") || (currentUser.role?.name || "").includes("CRM");
  const isHR = deptName.includes("Human") || (currentUser.role?.name || "").includes("HR");
  const isOps = deptName.includes("Operations") || (currentUser.role?.name || "").includes("Inventory");

  return (
    <div className="space-y-6">
      <WelcomeBanner user={currentUser} taskCount={tasks.length} />

      {/* Role-aware Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isFinance || isExecutive) && (
          <>
            <KpiCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} change={12.5} changeLabel="vs last quarter" icon={DollarSign} />
            <KpiCard title="Net Income" value={formatCurrency(stats?.netIncome || 0)} change={18.3} changeLabel="vs last quarter" icon={TrendingUp} iconColor="text-emerald-600" />
          </>
        )}
        {(isCRM || isExecutive) && (
          <>
            <KpiCard title="Active Deals" value="8" change={15.0} changeLabel="vs last quarter" icon={Handshake} />
            <KpiCard title="Total Leads" value="15" change={22.5} changeLabel="vs last quarter" icon={Target} />
          </>
        )}
        {(isHR || isExecutive) && (
          <>
            <KpiCard title="Total Employees" value="18" change={5.0} changeLabel="this quarter" icon={Users} />
            <KpiCard title="Active Staff" value="17" icon={UserCheck} iconColor="text-emerald-600" />
          </>
        )}
        {isOps && (
          <>
            <KpiCard title="Pending Orders" value="4" icon={Package} />
            <KpiCard title="Inventory Items" value="95" icon={Receipt} />
          </>
        )}
        {!isFinance && !isCRM && !isHR && !isOps && !isExecutive && (
          <>
            <KpiCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={DollarSign} />
            <KpiCard title="Active Deals" value="8" icon={Handshake} />
          </>
        )}
      </div>

      {/* Tasks */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Loading tasks...</CardContent></Card>
          ) : (
            <TaskList tasks={tasks} />
          )}
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(isFinance || isExecutive) && (
                <>
                  <QuickLink href="/finance/journal-entries/new" label="Create Journal Entry" module="Finance" />
                  <QuickLink href="/finance/reports" label="View Financial Reports" module="Finance" />
                  <QuickLink href="/finance/accounts-payable" label="Review Payables" module="Finance" />
                </>
              )}
              {(isCRM || isExecutive) && (
                <>
                  <QuickLink href="/crm/deals" label="View Deal Pipeline" module="CRM" />
                  <QuickLink href="/crm/leads" label="Manage Leads" module="CRM" />
                  <QuickLink href="/crm/contacts" label="View Contacts" module="CRM" />
                </>
              )}
              {(isHR || isExecutive) && (
                <QuickLink href="/admin/users" label="Manage Users" module="HR" />
              )}
              {(isOps || isExecutive) && (
                <QuickLink href="/finance/accounts-payable" label="View Purchase Orders" module="Ops" />
              )}
              <QuickLink href="/copilot" label="Open AI Copilot" module="AI" />
              {isExecutive && (
                <QuickLink href="/admin/org-chart" label="View Org Chart" module="Admin" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ href, label, module }: { href: string; label: string; module: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-accent hover:border-primary/20 transition-colors group"
    >
      <span className="text-sm group-hover:text-foreground text-muted-foreground">{label}</span>
      <Badge variant="outline" className="text-[10px]">{module}</Badge>
    </Link>
  );
}
