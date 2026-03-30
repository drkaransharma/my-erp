import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const leave = await prisma.leaveRequest.update({ where: { id }, data: body, include: { employee: true } });
  return NextResponse.json(leave);
}
