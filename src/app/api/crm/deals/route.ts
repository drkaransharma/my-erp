import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const deals = await prisma.crmDeal.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: true, company: true },
  });
  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, companyId, contactId, value, stage, probability, expectedCloseDate, notes } = body;

  if (!title) {
    return NextResponse.json({ error: "Deal title is required" }, { status: 400 });
  }

  const deal = await prisma.crmDeal.create({
    data: {
      title, value: value || 0, stage, probability: probability || 10, notes,
      companyId: companyId || null, contactId: contactId || null,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
    },
    include: { contact: true, company: true },
  });

  return NextResponse.json(deal, { status: 201 });
}
