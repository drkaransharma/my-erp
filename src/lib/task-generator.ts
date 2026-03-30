import { prisma } from "@/lib/prisma";

export interface GeneratedTask {
  id: string;
  title: string;
  module: "finance" | "crm" | "hr" | "inventory" | "general";
  priority: "high" | "medium" | "low";
  dueLabel: string;
  href: string;
}

export async function generateTasksForUser(userId: string): Promise<GeneratedTask[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true, department: true },
  });

  if (!user) return [];

  const deptName = user.department?.name || "";
  const roleName = user.role?.name || "";
  const isExecutive = deptName === "Executive" || roleName === "Super Admin";
  const isFinance = deptName === "Finance" || roleName.includes("Finance");
  const isCRM = deptName.includes("Sales") || deptName.includes("CRM") || roleName.includes("CRM");
  const isHR = deptName.includes("Human") || roleName.includes("HR");
  const isOps = deptName.includes("Operations") || roleName.includes("Inventory");
  const isIT = deptName.includes("IT") || deptName.includes("Engineering");

  const tasks: GeneratedTask[] = [];
  let taskIdx = 0;
  const makeId = () => `task-${taskIdx++}`;

  // ===== FINANCE TASKS =====
  if (isFinance || isExecutive) {
    const overdueBills = await prisma.bill.findMany({
      where: { status: "OVERDUE" },
      include: { vendor: true },
    });
    for (const bill of overdueBills) {
      tasks.push({ id: makeId(), title: `Pay overdue bill ${bill.billNumber} to ${bill.vendor.name} ($${(Number(bill.amount) - Number(bill.amountPaid)).toLocaleString()})`, module: "finance", priority: "high", dueLabel: "Overdue", href: "/finance/accounts-payable" });
    }

    const overdueInvoices = await prisma.invoice.findMany({ where: { status: "OVERDUE" }, include: { customer: true } });
    for (const inv of overdueInvoices) {
      tasks.push({ id: makeId(), title: `Follow up on overdue invoice ${inv.invoiceNumber} from ${inv.customer.name} ($${(Number(inv.amount) - Number(inv.amountPaid)).toLocaleString()})`, module: "finance", priority: "high", dueLabel: "Overdue", href: "/finance/accounts-receivable" });
    }

    const draftEntries = await prisma.journalEntry.findMany({ where: { status: "DRAFT" } });
    for (const entry of draftEntries) {
      tasks.push({ id: makeId(), title: `Review and post draft entry ${entry.entryNumber} — "${entry.description}"`, module: "finance", priority: "medium", dueLabel: "This week", href: "/finance/journal-entries" });
    }

    const pendingBills = await prisma.bill.findMany({ where: { status: "PENDING" }, include: { vendor: true }, take: 3 });
    for (const bill of pendingBills) {
      tasks.push({ id: makeId(), title: `Process pending bill ${bill.billNumber} from ${bill.vendor.name} ($${Number(bill.amount).toLocaleString()})`, module: "finance", priority: "medium", dueLabel: `Due ${bill.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, href: "/finance/accounts-payable" });
    }

    tasks.push({ id: makeId(), title: "Prepare monthly financial reconciliation report", module: "finance", priority: "medium", dueLabel: "End of month", href: "/finance/reports" });
  }

  // ===== CRM TASKS =====
  if (isCRM || isExecutive) {
    const negotiationDeals = await prisma.crmDeal.findMany({ where: { stage: "NEGOTIATION" }, include: { company: true } });
    for (const deal of negotiationDeals) {
      tasks.push({ id: makeId(), title: `Follow up on deal: "${deal.title}"${deal.company ? ` with ${deal.company.name}` : ""} ($${Number(deal.value).toLocaleString()})`, module: "crm", priority: "high", dueLabel: "This week", href: "/crm/deals" });
    }

    const proposalDeals = await prisma.crmDeal.findMany({ where: { stage: "PROPOSAL" }, include: { company: true } });
    for (const deal of proposalDeals) {
      tasks.push({ id: makeId(), title: `Send proposal for deal: "${deal.title}"${deal.company ? ` to ${deal.company.name}` : ""}`, module: "crm", priority: "medium", dueLabel: "This week", href: "/crm/deals" });
    }

    const newLeads = await prisma.crmLead.findMany({ where: { status: "NEW" }, include: { company: true } });
    for (const lead of newLeads) {
      tasks.push({ id: makeId(), title: `Reach out to new lead: "${lead.title}"${lead.company ? ` (${lead.company.name})` : ""}`, module: "crm", priority: "medium", dueLabel: "This week", href: "/crm/leads" });
    }

    const staleLeads = await prisma.crmLead.findMany({ where: { status: "CONTACTED" }, include: { company: true }, take: 3 });
    for (const lead of staleLeads) {
      tasks.push({ id: makeId(), title: `Re-engage lead: "${lead.title}"${lead.company ? ` at ${lead.company.name}` : ""}`, module: "crm", priority: "low", dueLabel: "This week", href: "/crm/leads" });
    }
  }

  // ===== HR TASKS =====
  if (isHR || isExecutive) {
    tasks.push(
      { id: makeId(), title: "Review employee onboarding pipeline for new hires", module: "hr", priority: "medium", dueLabel: "This week", href: "/admin/users" },
      { id: makeId(), title: "Prepare weekly headcount and attendance report", module: "hr", priority: "medium", dueLabel: "Friday", href: "/admin/dashboard" },
      { id: makeId(), title: "Update HR compliance documentation for Q1", module: "hr", priority: "low", dueLabel: "End of month", href: "/admin/departments" },
    );
  }

  // ===== OPERATIONS/INVENTORY TASKS =====
  if (isOps || isExecutive) {
    tasks.push(
      { id: makeId(), title: "Review inventory stock levels and reorder thresholds", module: "inventory", priority: "medium", dueLabel: "This week", href: "/finance/accounts-payable" },
      { id: makeId(), title: "Process pending purchase orders", module: "inventory", priority: "medium", dueLabel: "This week", href: "/finance/accounts-payable" },
      { id: makeId(), title: "Update warehouse logistics and shipping schedule", module: "inventory", priority: "low", dueLabel: "Friday", href: "/finance/accounts-payable" },
    );
  }

  // ===== IT TASKS =====
  if (isIT) {
    tasks.push(
      { id: makeId(), title: "Review system uptime and performance reports", module: "general", priority: "medium", dueLabel: "This week", href: "/admin/dashboard" },
      { id: makeId(), title: "Check CI/CD deployment pipeline status", module: "general", priority: "medium", dueLabel: "Today", href: "/admin/dashboard" },
      { id: makeId(), title: "Apply pending security patches and updates", module: "general", priority: "low", dueLabel: "This week", href: "/settings" },
    );
  }

  // ===== EXECUTIVE EXTRAS =====
  if (isExecutive) {
    tasks.push(
      { id: makeId(), title: "Review cross-department KPI dashboard", module: "general", priority: "medium", dueLabel: "Monday", href: "/admin/dashboard" },
      { id: makeId(), title: "Prepare board meeting agenda and talking points", module: "general", priority: "low", dueLabel: "Friday", href: "/admin/org-chart" },
    );
  }

  // Sort: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tasks;
}
