export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/finance/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const statusVariant: Record<string, "success" | "secondary" | "destructive" | "warning"> = {
  PAID: "success",
  PENDING: "secondary",
  OVERDUE: "destructive",
  PARTIAL: "warning",
};

export default async function AccountsReceivablePage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { dueDate: "asc" },
    include: { customer: true },
  });

  const totalOutstanding = invoices
    .filter((i) => i.status !== "PAID")
    .reduce((sum, i) => sum + Number(i.amount) - Number(i.amountPaid), 0);

  const overdueAmount = invoices
    .filter((i) => i.status === "OVERDUE")
    .reduce((sum, i) => sum + Number(i.amount) - Number(i.amountPaid), 0);

  const collectedTotal = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.amountPaid), 0);

  const pendingCount = invoices.filter((i) => i.status === "PENDING" || i.status === "PARTIAL").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts Receivable" description="Track customer invoices and payments" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Outstanding" value={formatCurrency(totalOutstanding)} icon={Receipt} />
        <KpiCard title="Overdue Amount" value={formatCurrency(overdueAmount)} icon={AlertTriangle} iconColor="text-red-600" />
        <KpiCard title="Collected (Total)" value={formatCurrency(collectedTotal)} icon={CheckCircle} iconColor="text-emerald-600" />
        <KpiCard title="Pending Invoices" value={String(pendingCount)} icon={Clock} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const balance = Number(invoice.amount) - Number(invoice.amountPaid);
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="font-medium">{invoice.customer.name}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(Number(invoice.amount))}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(Number(invoice.amountPaid))}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(balance)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{invoices.length} invoices total</p>
    </div>
  );
}
