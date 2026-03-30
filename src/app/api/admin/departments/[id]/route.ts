import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const dept = await prisma.department.update({ where: { id }, data: body, include: { head: true } });
  return NextResponse.json(dept);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.department.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
