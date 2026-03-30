"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { PurchaseOrder } from "@/types/inventory";

const statusColors: Record<string, "success" | "secondary" | "default" | "destructive"> = { RECEIVED: "success", DRAFT: "secondary", ORDERED: "default", CANCELLED: "destructive" };

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => { fetch("/api/inventory/purchase-orders").then(r => r.json()).then(setOrders); }, []);

  const filtered = orders.filter(o => statusFilter === "ALL" || o.status === statusFilter);

  return (
    <div>
      <PageHeader title="Purchase Orders" description="Track purchase orders from suppliers" />
      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Status</SelectItem><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="ORDERED">Ordered</SelectItem><SelectItem value="RECEIVED">Received</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>PO Number</TableHead><TableHead>Supplier</TableHead><TableHead>Date</TableHead><TableHead className="text-center">Items</TableHead><TableHead className="text-right">Total Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-sm">{o.poNumber}</TableCell>
                <TableCell className="font-medium">{o.supplier?.name || "—"}</TableCell>
                <TableCell className="text-sm">{formatDate(o.date)}</TableCell>
                <TableCell className="text-center"><Badge variant="secondary">{o._count?.items ?? 0}</Badge></TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(Number(o.totalAmount))}</TableCell>
                <TableCell><Badge variant={statusColors[o.status]}>{o.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} orders</p>
    </div>
  );
}
