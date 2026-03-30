import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const role = await prisma.role.update({ where: { id }, data: body });
  return NextResponse.json(role);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const role = await prisma.role.findUnique({ where: { id } });
  if (role?.isSystem) return NextResponse.json({ error: "Cannot delete system roles" }, { status: 400 });
  await prisma.role.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
