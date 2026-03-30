import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "pnl";
  const accounts = await prisma.account.findMany({ orderBy: { code: "asc" } });

  if (type === "pnl") {
    const revenue = accounts
      .filter((a) => a.type === "REVENUE")
      .map((a) => ({ code: a.code, name: a.name, balance: Number(a.balance) }));
    const expenses = accounts
      .filter((a) => a.type === "EXPENSE")
      .map((a) => ({ code: a.code, name: a.name, balance: Number(a.balance) }));

    const totalRevenue = revenue.reduce((s, a) => s + a.balance, 0);
    const totalExpenses = expenses.reduce((s, a) => s + a.balance, 0);
    const netIncome = totalRevenue - totalExpenses;

    return NextResponse.json({ revenue, expenses, totalRevenue, totalExpenses, netIncome });
  }

  if (type === "balance-sheet") {
    const assets = accounts
      .filter((a) => a.type === "ASSET")
      .map((a) => ({ code: a.code, name: a.name, balance: Number(a.balance) }));
    const liabilities = accounts
      .filter((a) => a.type === "LIABILITY")
      .map((a) => ({ code: a.code, name: a.name, balance: Number(a.balance) }));
    const equity = accounts
      .filter((a) => a.type === "EQUITY")
      .map((a) => ({ code: a.code, name: a.name, balance: Number(a.balance) }));

    const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
    const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);

    const totalRevenue = accounts.filter((a) => a.type === "REVENUE").reduce((s, a) => s + Number(a.balance), 0);
    const totalExpenses = accounts.filter((a) => a.type === "EXPENSE").reduce((s, a) => s + Number(a.balance), 0);
    const netIncome = totalRevenue - totalExpenses;

    const totalEquity = equity.reduce((s, a) => s + a.balance, 0) + netIncome;

    return NextResponse.json({
      assets, liabilities, equity, netIncome,
      totalAssets, totalLiabilities, totalEquity,
    });
  }

  if (type === "trial-balance") {
    const trialBalance = accounts.map((a) => {
      const bal = Number(a.balance);
      const isDebitNormal = a.type === "ASSET" || a.type === "EXPENSE";
      return {
        code: a.code,
        name: a.name,
        type: a.type,
        debit: isDebitNormal ? Math.abs(bal) : (bal < 0 ? Math.abs(bal) : 0),
        credit: isDebitNormal ? (bal < 0 ? Math.abs(bal) : 0) : Math.abs(bal),
      };
    });

    const totalDebit = trialBalance.reduce((s, a) => s + a.debit, 0);
    const totalCredit = trialBalance.reduce((s, a) => s + a.credit, 0);

    return NextResponse.json({ accounts: trialBalance, totalDebit, totalCredit });
  }

  return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
}
