export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  POSTED: "success",
  DRAFT: "secondary",
  VOIDED: "destructive",
};

export default async function JournalEntriesPage() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    include: {
      lines: { include: { account: true } },
    },
  });

  return (
    <div>
      <PageHeader title="Journal Entries" description="View and create journal entries">
        <Link href="/finance/journal-entries/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </PageHeader>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entry #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-sm">{entry.entryNumber}</TableCell>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">{entry.description}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{entry.reference || "—"}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(Number(entry.totalDebit))}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/finance/journal-entries/${entry.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{entries.length} entries total</p>
    </div>
  );
}
