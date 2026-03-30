"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { Pencil, Search, LayoutGrid, List } from "lucide-react";
import type { CrmDeal } from "@/types/crm";

const stageColors: Record<string, string> = {
  PROSPECTING: "bg-slate-100 text-slate-800",
  QUALIFICATION: "bg-blue-100 text-blue-800",
  PROPOSAL: "bg-purple-100 text-purple-800",
  NEGOTIATION: "bg-amber-100 text-amber-800",
  CLOSED_WON: "bg-emerald-100 text-emerald-800",
  CLOSED_LOST: "bg-red-100 text-red-800",
};

const stageLabels: Record<string, string> = {
  PROSPECTING: "Prospecting", QUALIFICATION: "Qualification", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
};

const stageOrder = ["PROSPECTING", "QUALIFICATION", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

interface DealsTableProps {
  deals: CrmDeal[];
  onEdit: (deal: CrmDeal) => void;
}

export function DealsTable({ deals, onEdit }: DealsTableProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "pipeline">("pipeline");

  const filtered = deals.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.company?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const groupedByStage = stageOrder.map((stage) => ({
    stage,
    label: stageLabels[stage],
    deals: filtered.filter((d) => d.stage === stage),
    total: filtered.filter((d) => d.stage === stage).reduce((s, d) => s + Number(d.value), 0),
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex border rounded-md">
          <Button variant={view === "pipeline" ? "secondary" : "ghost"} size="sm" onClick={() => setView("pipeline")} className="rounded-r-none">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" onClick={() => setView("table")} className="rounded-l-none">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "pipeline" ? (
        <div className="grid grid-cols-6 gap-3">
          {groupedByStage.map((group) => (
            <div key={group.stage} className="space-y-2">
              <div className="text-center">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[group.stage]}`}>
                  {group.label}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{group.deals.length} deals &middot; {formatCurrency(group.total)}</p>
              </div>
              <div className="space-y-2">
                {group.deals.map((deal) => (
                  <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEdit(deal)}>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate">{deal.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{deal.company?.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-mono font-medium">{formatCurrency(Number(deal.value))}</span>
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-center">Prob.</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell className="text-muted-foreground">{deal.company?.name || "—"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[deal.stage]}`}>
                      {stageLabels[deal.stage]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(Number(deal.value))}</TableCell>
                  <TableCell className="text-center">{deal.probability}%</TableCell>
                  <TableCell className="text-sm">{deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(deal)}><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{filtered.length} deals</p>
    </div>
  );
}
