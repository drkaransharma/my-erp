import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.crmContact.findMany({
    orderBy: { lastName: "asc" },
    include: { company: true },
  });
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, phone, title, companyId, status, notes } = body;

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
  }

  const contact = await prisma.crmContact.create({
    data: { firstName, lastName, email, phone, title, companyId: companyId || null, status, notes },
    include: { company: true },
  });

  return NextResponse.json(contact, { status: 201 });
}
