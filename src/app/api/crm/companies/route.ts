import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.crmCompany.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { contacts: true, deals: true } },
      deals: { select: { value: true } },
    },
  });

  const result = companies.map((c) => ({
    ...c,
    _count: c._count,
    _dealValue: c.deals.reduce((sum, d) => sum + Number(d.value), 0),
    deals: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, industry, website, phone, address, notes } = body;

  if (!name) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  const company = await prisma.crmCompany.create({
    data: { name, industry, website, phone, address, notes },
  });

  return NextResponse.json(company, { status: 201 });
}
