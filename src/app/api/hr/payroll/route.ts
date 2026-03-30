import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.payrollRecord.findMany({
      orderBy: [{ month: "desc" }, { employee: { lastName: "asc" } }],
      include: { employee: { include: { department: true } } },
    });
    return NextResponse.json(records);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
