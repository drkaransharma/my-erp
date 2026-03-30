"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@/types/finance";

interface LineItem {
  accountId: string;
  description: string;
  debit: string;
  credit: string;
}

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { accountId: "", description: "", debit: "", credit: "" },
    { accountId: "", description: "", debit: "", credit: "" },
  ]);

  useEffect(() => {
    fetch("/api/accounts").then((res) => res.json()).then(setAccounts);
  }, []);

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
  const difference = totalDebit - totalCredit;

  const addLine = () => {
    setLines([...lines, { accountId: "", description: "", debit: "", credit: "" }]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleSubmit = async (status: "DRAFT" | "POSTED") => {
    if (!description || !date) {
      setError("Date and description are required");
      return;
    }

    if (status === "POSTED" && !isBalanced) {
      setError("Debits must equal credits to post an entry");
      return;
    }

    const validLines = lines.filter((l) => l.accountId && (parseFloat(l.debit) || parseFloat(l.credit)));
    if (validLines.length < 2) {
      setError("At least 2 lines with accounts and amounts are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/journal-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          description,
          reference: reference || null,
          status,
          lines: validLines.map((l) => ({
            accountId: l.accountId,
            description: l.description || null,
            debit: parseFloat(l.debit) || 0,
            credit: parseFloat(l.credit) || 0,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create entry");
      }

      router.push("/finance/journal-entries");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Journal Entry" description="Create a new journal entry" />

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Header fields */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Entry description" required />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional reference #" />
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-3">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-3 text-sm font-medium text-muted-foreground">
              <span>Account</span>
              <span>Description</span>
              <span>Debit</span>
              <span>Credit</span>
              <span></span>
            </div>
            {lines.map((line, index) => (
              <div key={index} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-3">
                <Select value={line.accountId} onValueChange={(v) => updateLine(index, "accountId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={line.description}
                  onChange={(e) => updateLine(index, "description", e.target.value)}
                  placeholder="Line description"
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={line.debit}
                  onChange={(e) => updateLine(index, "debit", e.target.value)}
                  placeholder="0.00"
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={line.credit}
                  onChange={(e) => updateLine(index, "credit", e.target.value)}
                  placeholder="0.00"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLine(index)}
                  disabled={lines.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4 mr-1" />
              Add Line
            </Button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-[300px] space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Debits:</span>
                <span className="font-mono font-medium">{formatCurrency(totalDebit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Credits:</span>
                <span className="font-mono font-medium">{formatCurrency(totalCredit)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Difference:</span>
                <span className={`font-mono font-bold ${isBalanced ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(Math.abs(difference))}
                  {isBalanced && " (Balanced)"}
                </span>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button variant="secondary" onClick={() => handleSubmit("DRAFT")} disabled={loading}>
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit("POSTED")} disabled={loading || !isBalanced}>
              Post Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
