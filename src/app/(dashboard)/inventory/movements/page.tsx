"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { StockMovement } from "@/types/inventory";

const typeColors: Record<string, "success" | "destructive" | "secondary"> = { IN: "success", OUT: "destructive", TRANSFER: "secondary" };
const typeLabels: Record<string, string> = { IN: "Received", OUT: "Shipped", TRANSFER: "Transfer" };

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetch("/api/inventory/movements").then(r => r.json()).then(setMovements); }, []);

  const filtered = movements.filter(m => (m.product?.name || "").toLowerCase().includes(search.toLowerCase()) || (m.reference || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Stock Movements" description="Track all inventory inflows, outflows, and transfers" />
      <div className="relative max-w-sm mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by product or reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Warehouse</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead>Reference</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-sm">{formatDate(m.date)}</TableCell>
                <TableCell className="font-medium">{m.product?.name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.warehouse?.name || "—"}</TableCell>
                <TableCell><Badge variant={typeColors[m.type]}>{typeLabels[m.type]}</Badge></TableCell>
                <TableCell className="text-right font-mono">{m.type === "OUT" ? `-${m.quantity}` : `+${m.quantity}`}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{m.reference || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} movements</p>
    </div>
  );
}
