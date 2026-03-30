import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { employee: { include: { department: true } } },
    });
    return NextResponse.json(leaves);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const leave = await prisma.leaveRequest.create({
    data: {
      employeeId: body.employeeId, leaveType: body.leaveType,
      startDate: new Date(body.startDate), endDate: new Date(body.endDate),
      days: body.days, reason: body.reason,
    },
    include: { employee: true },
  });
  return NextResponse.json(leave, { status: 201 });
}
