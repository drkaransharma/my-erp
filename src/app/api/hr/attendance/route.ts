import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.attendance.findMany({
      orderBy: { date: "desc" },
      include: { employee: { include: { department: true } } },
      take: 200,
    });
    return NextResponse.json(records);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
