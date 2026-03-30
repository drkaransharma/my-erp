"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { Pencil, Search, Globe } from "lucide-react";
import type { CrmCompany } from "@/types/crm";

interface CompaniesTableProps {
  companies: CrmCompany[];
  onEdit?: (company: CrmCompany) => void;
}

export function CompaniesTable({ companies, onEdit }: CompaniesTableProps) {
  const [search, setSearch] = useState("");

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Contacts</TableHead>
              <TableHead className="text-center">Deals</TableHead>
              <TableHead className="text-right">Deal Value</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{company.name}</span>
                    {company.website && <Globe className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{company.industry || "—"}</TableCell>
                <TableCell className="text-sm">{company.phone || "—"}</TableCell>
                <TableCell className="text-center">{company._count?.contacts ?? 0}</TableCell>
                <TableCell className="text-center">{company._count?.deals ?? 0}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(company._dealValue ?? 0)}</TableCell>
                <TableCell>
                  {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(company)}>
                    <Pencil className="h-4 w-4" />
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No companies found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} companies</p>
    </div>
  );
}
