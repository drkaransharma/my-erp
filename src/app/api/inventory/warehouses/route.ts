import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });
    return NextResponse.json(warehouses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const warehouse = await prisma.warehouse.create({ data: body });
  return NextResponse.json(warehouse, { status: 201 });
}
