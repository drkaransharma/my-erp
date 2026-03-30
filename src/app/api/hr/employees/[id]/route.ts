import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (body.joinDate) body.joinDate = new Date(body.joinDate);
  const employee = await prisma.employee.update({ where: { id }, data: body, include: { department: true, manager: true } });
  return NextResponse.json(employee);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.employee.update({ where: { id }, data: { status: "TERMINATED" } });
  return NextResponse.json({ success: true });
}
