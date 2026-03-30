import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const order = await prisma.purchaseOrder.update({ where: { id }, data: body, include: { supplier: true } });
  return NextResponse.json(order);
}
