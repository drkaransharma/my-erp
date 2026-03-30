import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    include: {
      lines: {
        include: { account: true },
      },
    },
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, description, reference, status, lines } = body;

  if (!date || !description || !lines || lines.length < 2) {
    return NextResponse.json(
      { error: "Date, description, and at least 2 lines are required" },
      { status: 400 }
    );
  }

  const totalDebit = lines.reduce((sum: number, l: any) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum: number, l: any) => sum + (Number(l.credit) || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return NextResponse.json(
      { error: "Total debits must equal total credits" },
      { status: 400 }
    );
  }

  // Generate entry number
  const count = await prisma.journalEntry.count();
  const entryNumber = `JE-2026-${String(count + 1).padStart(4, "0")}`;

  const entry = await prisma.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(date),
      description,
      reference: reference || null,
      status: status || "DRAFT",
      totalDebit,
      totalCredit,
      lines: {
        create: lines.map((line: any) => ({
          accountId: line.accountId,
          description: line.description || null,
          debit: Number(line.debit) || 0,
          credit: Number(line.credit) || 0,
        })),
      },
    },
    include: {
      lines: { include: { account: true } },
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
