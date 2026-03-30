"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import { Pencil, Search } from "lucide-react";
import type { CrmLead } from "@/types/crm";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-sky-100 text-sky-800",
  QUALIFIED: "bg-indigo-100 text-indigo-800",
  PROPOSAL: "bg-purple-100 text-purple-800",
  NEGOTIATION: "bg-amber-100 text-amber-800",
  WON: "bg-emerald-100 text-emerald-800",
  LOST: "bg-red-100 text-red-800",
};

const sourceLabels: Record<string, string> = {
  WEBSITE: "Website", REFERRAL: "Referral", LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call", TRADE_SHOW: "Trade Show", OTHER: "Other",
};

interface LeadsTableProps {
  leads: CrmLead[];
  onEdit: (lead: CrmLead) => void;
}

export function LeadsTable({ leads, onEdit }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = leads.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || (l.company?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="QUALIFIED">Qualified</SelectItem>
            <SelectItem value="PROPOSAL">Proposal</SelectItem>
            <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
            <SelectItem value="WON">Won</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.title}</TableCell>
                <TableCell className="text-muted-foreground">{lead.company?.name || "—"}</TableCell>
                <TableCell><Badge variant="outline">{sourceLabels[lead.source]}</Badge></TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(lead.value)}</TableCell>
                <TableCell className="text-sm">{lead.assignedTo || "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(lead)}><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No leads found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} leads</p>
    </div>
  );
}
