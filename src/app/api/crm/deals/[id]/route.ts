import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await prisma.crmDeal.findUnique({ where: { id }, include: { contact: true, company: true } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (body.expectedCloseDate) body.expectedCloseDate = new Date(body.expectedCloseDate);
  if (body.actualCloseDate) body.actualCloseDate = new Date(body.actualCloseDate);
  const deal = await prisma.crmDeal.update({ where: { id }, data: body, include: { contact: true, company: true } });
  return NextResponse.json(deal);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.crmDeal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
