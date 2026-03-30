import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({
      orderBy: { date: "desc" },
      include: { product: true, warehouse: true },
      take: 100,
    });
    return NextResponse.json(movements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
