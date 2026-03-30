"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CrmDeal, CrmCompany, CrmContact } from "@/types/crm";

const stageProbability: Record<string, number> = {
  PROSPECTING: 10, QUALIFICATION: 25, PROPOSAL: 50,
  NEGOTIATION: 75, CLOSED_WON: 100, CLOSED_LOST: 0,
};

interface DealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: CrmDeal | null;
  companies: CrmCompany[];
  contacts: CrmContact[];
  onSave: () => void;
}

export function DealForm({ open, onOpenChange, deal, companies, contacts, onSave }: DealFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [probability, setProbability] = useState(deal?.probability ?? 10);
  const isEditing = !!deal;

  function handleStageChange(stage: string) {
    setProbability(stageProbability[stage] ?? 10);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      companyId: (fd.get("companyId") as string) || null,
      contactId: (fd.get("contactId") as string) || null,
      value: parseFloat(fd.get("value") as string) || 0,
      stage: fd.get("stage") as string,
      probability: parseInt(fd.get("probability") as string) || 0,
      expectedCloseDate: (fd.get("expectedCloseDate") as string) || null,
      notes: (fd.get("notes") as string) || null,
    };
    try {
      const res = await fetch(isEditing ? `/api/crm/deals/${deal.id}` : "/api/crm/deals", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      onSave();
      onOpenChange(false);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{isEditing ? "Edit Deal" : "Add Deal"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input id="title" name="title" defaultValue={deal?.title ?? ""} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Select name="companyId" defaultValue={deal?.companyId ?? ""}>
                <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Select name="contactId" defaultValue={deal?.contactId ?? ""}>
                <SelectTrigger><SelectValue placeholder="Select contact" /></SelectTrigger>
                <SelectContent>{contacts.map((c) => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value ($)</Label>
              <Input id="value" name="value" type="number" step="0.01" defaultValue={deal?.value ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select name="stage" defaultValue={deal?.stage ?? "PROSPECTING"} onValueChange={handleStageChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROSPECTING">Prospecting</SelectItem>
                  <SelectItem value="QUALIFICATION">Qualification</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input id="probability" name="probability" type="number" min="0" max="100" value={probability} onChange={(e) => setProbability(parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input id="expectedCloseDate" name="expectedCloseDate" type="date" defaultValue={deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split("T")[0] : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" defaultValue={deal?.notes ?? ""} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
