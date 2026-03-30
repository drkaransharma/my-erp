"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { useUser } from "@/lib/user-context";
import type { Warehouse } from "@/types/inventory";

export default function WarehousesPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("inventory", "create");
  const canEdit = hasPermission("inventory", "edit");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  const fetchData = useCallback(async () => { setWarehouses(await (await fetch("/api/inventory/warehouses")).json()); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = { name: fd.get("name"), location: fd.get("location") || null, capacity: parseInt(fd.get("capacity") as string) || 1000, description: fd.get("description") || null };
    await fetch(editing ? `/api/inventory/warehouses/${editing.id}` : "/api/inventory/warehouses", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setFormOpen(false); fetchData();
  }

  return (
    <div>
      <PageHeader title="Warehouses" description="Manage storage facilities and capacity">
        {canCreate && <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Warehouse</Button>}
      </PageHeader>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Warehouse</TableHead><TableHead>Location</TableHead><TableHead className="text-center">Capacity</TableHead><TableHead className="text-center">Products</TableHead><TableHead>Description</TableHead><TableHead className="w-[60px]"></TableHead></TableRow></TableHeader>
          <TableBody>
            {warehouses.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell className="text-sm">{w.location || "—"}</TableCell>
                <TableCell className="text-center font-mono">{w.capacity}</TableCell>
                <TableCell className="text-center"><Badge variant="secondary">{w._count?.products ?? 0}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{w.description || "—"}</TableCell>
                <TableCell>{canEdit && <Button variant="ghost" size="icon" onClick={() => { setEditing(w); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(canCreate || canEdit) && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name *</Label><Input name="name" defaultValue={editing?.name ?? ""} required /></div>
              <div className="space-y-2"><Label>Location</Label><Input name="location" defaultValue={editing?.location ?? ""} /></div>
              <div className="space-y-2"><Label>Capacity</Label><Input name="capacity" type="number" defaultValue={editing?.capacity ?? 1000} /></div>
              <div className="space-y-2"><Label>Description</Label><Input name="description" defaultValue={editing?.description ?? ""} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
