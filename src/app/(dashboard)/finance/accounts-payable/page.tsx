export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/finance/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const statusVariant: Record<string, "success" | "secondary" | "destructive" | "warning"> = {
  PAID: "success",
  PENDING: "secondary",
  OVERDUE: "destructive",
  PARTIAL: "warning",
};

export default async function AccountsPayablePage() {
  const bills = await prisma.bill.findMany({
    orderBy: { dueDate: "asc" },
    include: { vendor: true },
  });

  const totalOutstanding = bills
    .filter((b) => b.status !== "PAID")
    .reduce((sum, b) => sum + Number(b.amount) - Number(b.amountPaid), 0);

  const overdueAmount = bills
    .filter((b) => b.status === "OVERDUE")
    .reduce((sum, b) => sum + Number(b.amount) - Number(b.amountPaid), 0);

  const paidThisMonth = bills
    .filter((b) => b.status === "PAID")
    .reduce((sum, b) => sum + Number(b.amountPaid), 0);

  const pendingCount = bills.filter((b) => b.status === "PENDING" || b.status === "PARTIAL").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts Payable" description="Track and manage vendor bills and payments" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Outstanding" value={formatCurrency(totalOutstanding)} icon={CreditCard} />
        <KpiCard title="Overdue Amount" value={formatCurrency(overdueAmount)} icon={AlertTriangle} iconColor="text-red-600" />
        <KpiCard title="Paid (Total)" value={formatCurrency(paidThisMonth)} icon={CheckCircle} iconColor="text-emerald-600" />
        <KpiCard title="Pending Bills" value={String(pendingCount)} icon={Clock} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => {
              const balance = Number(bill.amount) - Number(bill.amountPaid);
              return (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono text-sm">{bill.billNumber}</TableCell>
                  <TableCell className="font-medium">{bill.vendor.name}</TableCell>
                  <TableCell>{formatDate(bill.date)}</TableCell>
                  <TableCell>{formatDate(bill.dueDate)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(Number(bill.amount))}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(Number(bill.amountPaid))}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(balance)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[bill.status]}>{bill.status}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{bills.length} bills total</p>
    </div>
  );
}
