import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await prisma.crmContact.findUnique({ where: { id }, include: { company: true } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const contact = await prisma.crmContact.update({ where: { id }, data: body, include: { company: true } });
  return NextResponse.json(contact);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.crmContact.update({ where: { id }, data: { status: "INACTIVE" } });
  return NextResponse.json({ success: true });
}
