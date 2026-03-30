"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useUser } from "@/lib/user-context";
import type { Product, Warehouse } from "@/types/inventory";

const statusColors: Record<string, "success" | "warning" | "destructive"> = { IN_STOCK: "success", LOW_STOCK: "warning", OUT_OF_STOCK: "destructive" };
const statusLabels: Record<string, string> = { IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out of Stock" };

export default function ProductsPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("inventory", "create");
  const canEdit = hasPermission("inventory", "edit");
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchData = useCallback(async () => {
    const [pRes, wRes] = await Promise.all([fetch("/api/inventory/products"), fetch("/api/inventory/warehouses")]);
    setProducts(await pRes.json());
    setWarehouses(await wRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categories = [...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) && (catFilter === "ALL" || p.category === catFilter));

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = { sku: fd.get("sku"), name: fd.get("name"), category: fd.get("category"), description: fd.get("description") || null, quantity: parseInt(fd.get("quantity") as string) || 0, unitPrice: parseFloat(fd.get("unitPrice") as string) || 0, reorderLevel: parseInt(fd.get("reorderLevel") as string) || 10, warehouseId: fd.get("warehouseId") || null, status: fd.get("status") };
    await fetch(editing ? `/api/inventory/products/${editing.id}` : "/api/inventory/products", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setFormOpen(false);
    fetchData();
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage product inventory and stock levels">
        {canCreate && <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Product</Button>}
      </PageHeader>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={catFilter} onValueChange={setCatFilter}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Categories</SelectItem>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Warehouse</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Unit Price</TableHead><TableHead className="text-right">Total Value</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]"></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm">{p.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.warehouse?.name || "—"}</TableCell>
                <TableCell className="text-right font-mono">{p.quantity}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(p.unitPrice)}</TableCell>
                <TableCell className="text-right font-mono font-medium">{formatCurrency(p.quantity * Number(p.unitPrice))}</TableCell>
                <TableCell><Badge variant={statusColors[p.status]}>{statusLabels[p.status]}</Badge></TableCell>
                <TableCell>{canEdit && <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} products</p>

      {(canCreate || canEdit) && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>SKU *</Label><Input name="sku" defaultValue={editing?.sku ?? ""} required /></div><div className="space-y-2"><Label>Name *</Label><Input name="name" defaultValue={editing?.name ?? ""} required /></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Category *</Label><Input name="category" defaultValue={editing?.category ?? ""} required /></div><div className="space-y-2"><Label>Warehouse</Label><Select name="warehouseId" defaultValue={editing?.warehouseId ?? ""}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div></div>
              <div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label>Quantity</Label><Input name="quantity" type="number" defaultValue={editing?.quantity ?? 0} /></div><div className="space-y-2"><Label>Unit Price ($)</Label><Input name="unitPrice" type="number" step="0.01" defaultValue={editing?.unitPrice ?? ""} /></div><div className="space-y-2"><Label>Reorder Level</Label><Input name="reorderLevel" type="number" defaultValue={editing?.reorderLevel ?? 10} /></div></div>
              <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status ?? "IN_STOCK"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="IN_STOCK">In Stock</SelectItem><SelectItem value="LOW_STOCK">Low Stock</SelectItem><SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Description</Label><Input name="description" defaultValue={editing?.description ?? ""} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
