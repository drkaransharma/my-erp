"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";

interface ReportAccount {
  code: string;
  name: string;
  balance?: number;
  debit?: number;
  credit?: number;
  type?: string;
}

export default function ReportsPage() {
  const [pnl, setPnl] = useState<any>(null);
  const [bs, setBs] = useState<any>(null);
  const [tb, setTb] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pnl");

  useEffect(() => {
    if (activeTab === "pnl" && !pnl) {
      fetch("/api/reports?type=pnl").then((r) => r.json()).then(setPnl);
    }
    if (activeTab === "balance-sheet" && !bs) {
      fetch("/api/reports?type=balance-sheet").then((r) => r.json()).then(setBs);
    }
    if (activeTab === "trial-balance" && !tb) {
      fetch("/api/reports?type=trial-balance").then((r) => r.json()).then(setTb);
    }
  }, [activeTab, pnl, bs, tb]);

  return (
    <div>
      <PageHeader title="Financial Reports" description="View profit & loss, balance sheet, and trial balance" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
        </TabsList>

        {/* Profit & Loss */}
        <TabsContent value="pnl">
          <Card>
            <CardContent className="p-6">
              {pnl ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Revenue</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pnl.revenue.map((a: ReportAccount) => (
                          <TableRow key={a.code}>
                            <TableCell className="font-mono">{a.code}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(a.balance!)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">Total Revenue</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(pnl.totalRevenue)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Expenses</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pnl.expenses.map((a: ReportAccount) => (
                          <TableRow key={a.code}>
                            <TableCell className="font-mono">{a.code}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(a.balance!)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">Total Expenses</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(pnl.totalExpenses)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className="border-t-2 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Net Income</span>
                      <span className={`text-xl font-bold font-mono ${pnl.netIncome >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(pnl.netIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet">
          <Card>
            <CardContent className="p-6">
              {bs ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Assets</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bs.assets.map((a: ReportAccount) => (
                          <TableRow key={a.code}>
                            <TableCell className="font-mono">{a.code}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(a.balance!)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">Total Assets</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(bs.totalAssets)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Liabilities</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bs.liabilities.map((a: ReportAccount) => (
                          <TableRow key={a.code}>
                            <TableCell className="font-mono">{a.code}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(a.balance!)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">Total Liabilities</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(bs.totalLiabilities)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Equity</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bs.equity.map((a: ReportAccount) => (
                          <TableRow key={a.code}>
                            <TableCell className="font-mono">{a.code}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(a.balance!)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-mono">—</TableCell>
                          <TableCell className="italic">Net Income (Current Period)</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(bs.netIncome)}</TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">Total Equity</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(bs.totalEquity)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className="border-t-2 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Liabilities + Equity</span>
                      <span className="text-xl font-bold font-mono">
                        {formatCurrency(bs.totalLiabilities + bs.totalEquity)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trial Balance */}
        <TabsContent value="trial-balance">
          <Card>
            <CardContent className="p-6">
              {tb ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tb.accounts.map((a: ReportAccount) => (
                      <TableRow key={a.code}>
                        <TableCell className="font-mono">{a.code}</TableCell>
                        <TableCell>{a.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.type}</TableCell>
                        <TableCell className="text-right font-mono">
                          {a.debit! > 0 ? formatCurrency(a.debit!) : "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {a.credit! > 0 ? formatCurrency(a.credit!) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">Totals</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatCurrency(tb.totalDebit)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatCurrency(tb.totalCredit)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <p className="text-muted-foreground">Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
