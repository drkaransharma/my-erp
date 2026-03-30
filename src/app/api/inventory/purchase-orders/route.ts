import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      orderBy: { date: "desc" },
      include: { supplier: true, _count: { select: { items: true } } },
    });
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.purchaseOrder.count();
  const poNumber = `PO-2026-${String(count + 1).padStart(3, "0")}`;
  const order = await prisma.purchaseOrder.create({
    data: { poNumber, supplierId: body.supplierId, date: new Date(body.date || new Date()), totalAmount: body.totalAmount || 0, status: body.status || "DRAFT", notes: body.notes },
    include: { supplier: true },
  });
  return NextResponse.json(order, { status: 201 });
}
