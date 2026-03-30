export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { KpiCard } from "@/components/finance/kpi-card";
import { PipelineChart } from "@/components/crm/pipeline-chart";
import { LeadSourcesChart } from "@/components/crm/lead-sources-chart";
import { RevenuePipelineChart } from "@/components/crm/revenue-pipeline-chart";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Handshake, DollarSign, TrendingUp } from "lucide-react";

const stageLabels: Record<string, string> = {
  PROSPECTING: "Prospecting", QUALIFICATION: "Qualification", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Won", CLOSED_LOST: "Lost",
};

const sourceLabels: Record<string, string> = {
  WEBSITE: "Website", REFERRAL: "Referral", LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call", TRADE_SHOW: "Trade Show", OTHER: "Other",
};

async function getCrmDashboardData() {
  const [leads, deals, recentLeads] = await Promise.all([
    prisma.crmLead.findMany(),
    prisma.crmDeal.findMany({ include: { company: true } }),
    prisma.crmLead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { company: true } }),
  ]);

  const totalLeads = leads.length;
  const activeDeals = deals.filter((d) => !["CLOSED_WON", "CLOSED_LOST"].includes(d.stage));
  const activeDealCount = activeDeals.length;
  const pipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.value), 0);

  const wonLeads = leads.filter((l) => l.status === "WON").length;
  const lostLeads = leads.filter((l) => l.status === "LOST").length;
  const conversionRate = wonLeads + lostLeads > 0 ? (wonLeads / (wonLeads + lostLeads)) * 100 : 0;

  // Pipeline chart data
  const stageOrder = ["PROSPECTING", "QUALIFICATION", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
  const pipelineData = stageOrder.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage: stageLabels[stage],
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + Number(d.value), 0),
    };
  });

  // Lead sources chart data
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
  const leadSourcesData = Object.entries(sourceCounts).map(([source, count]) => ({
    name: sourceLabels[source] || source, value: count,
  }));

  // Revenue by stage
  const revenueByStage = stageOrder
    .filter((s) => s !== "CLOSED_LOST")
    .map((stage) => ({
      stage: stageLabels[stage],
      value: deals.filter((d) => d.stage === stage).reduce((s, d) => s + Number(d.value), 0),
    }));

  return { totalLeads, activeDealCount, pipelineValue, conversionRate, pipelineData, leadSourcesData, revenueByStage, recentLeads };
}

export default async function CrmDashboardPage() {
  const data = await getCrmDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader title="CRM Dashboard" description="Customer relationship management overview" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Leads" value={String(data.totalLeads)} change={22.5} changeLabel="vs last quarter" icon={Target} />
        <KpiCard title="Active Deals" value={String(data.activeDealCount)} change={15.0} changeLabel="vs last quarter" icon={Handshake} />
        <KpiCard title="Pipeline Value" value={formatCurrency(data.pipelineValue)} change={31.2} changeLabel="vs last quarter" icon={DollarSign} />
        <KpiCard title="Conversion Rate" value={`${data.conversionRate.toFixed(1)}%`} change={5.3} changeLabel="vs last quarter" icon={TrendingUp} iconColor="text-emerald-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PipelineChart data={data.pipelineData} />
        <LeadSourcesChart data={data.leadSourcesData} />
      </div>

      <RevenuePipelineChart data={data.revenueByStage} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lead.title}</p>
                  <p className="text-xs text-muted-foreground">{lead.company?.name || "No company"}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-mono">{formatCurrency(Number(lead.value))}</p>
                  <Badge variant="outline" className="text-[10px]">{lead.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
