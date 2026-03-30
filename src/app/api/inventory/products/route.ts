import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: "asc" }, include: { warehouse: true } });
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await prisma.product.create({ data: body, include: { warehouse: true } });
  return NextResponse.json(product, { status: 201 });
}
