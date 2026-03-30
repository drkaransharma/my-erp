import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const leads = await prisma.crmLead.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: true, company: true },
  });
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, contactId, companyId, source, status, value, assignedTo, probability, notes } = body;

  if (!title) {
    return NextResponse.json({ error: "Lead title is required" }, { status: 400 });
  }

  const lead = await prisma.crmLead.create({
    data: {
      title, source, status, value: value || 0, assignedTo, probability: probability || 0, notes,
      contactId: contactId || null, companyId: companyId || null,
    },
    include: { contact: true, company: true },
  });

  return NextResponse.json(lead, { status: 201 });
}
