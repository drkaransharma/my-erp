export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { KpiCard } from "@/components/finance/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, DollarSign, ShoppingCart } from "lucide-react";

export default async function InventoryDashboardPage() {
  const [totalProducts, lowStock, outOfStock, pendingPOs, products, recentMovements] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "LOW_STOCK" } }),
    prisma.product.count({ where: { status: "OUT_OF_STOCK" } }),
    prisma.purchaseOrder.count({ where: { status: { in: ["DRAFT", "ORDERED"] } } }),
    prisma.product.findMany(),
    prisma.stockMovement.findMany({ orderBy: { date: "desc" }, take: 5, include: { product: true, warehouse: true } }),
  ]);

  const totalValue = products.reduce((s, p) => s + p.quantity * Number(p.unitPrice), 0);

  const categories = products.reduce<Record<string, { count: number; value: number }>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, value: 0 };
    acc[p.category].count += p.quantity;
    acc[p.category].value += p.quantity * Number(p.unitPrice);
    return acc;
  }, {});

  const movementLabels: Record<string, string> = { IN: "Received", OUT: "Shipped", TRANSFER: "Transferred" };
  const movementColors: Record<string, "success" | "destructive" | "secondary"> = { IN: "success", OUT: "destructive", TRANSFER: "secondary" };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Dashboard" description="Stock levels, warehouse utilization, and supply chain overview" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value={String(totalProducts)} icon={Package} />
        <KpiCard title="Low / Out of Stock" value={`${lowStock + outOfStock}`} icon={AlertTriangle} iconColor="text-red-600" />
        <KpiCard title="Total Inventory Value" value={formatCurrency(totalValue)} icon={DollarSign} />
        <KpiCard title="Pending Orders" value={String(pendingPOs)} icon={ShoppingCart} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Stock by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categories).sort((a, b) => b[1].value - a[1].value).map(([cat, data]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cat}</p>
                    <p className="text-xs text-muted-foreground">{data.count} units</p>
                  </div>
                  <span className="font-mono text-sm font-medium">{formatCurrency(data.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Recent Stock Movements</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMovements.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{m.product.name}</p>
                    <p className="text-xs text-muted-foreground">{m.warehouse?.name || "—"} &middot; {m.reference}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={movementColors[m.type]}>{movementLabels[m.type]}</Badge>
                    <p className="text-xs font-mono mt-0.5">{m.type === "OUT" ? "-" : "+"}{m.quantity}</p>
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
