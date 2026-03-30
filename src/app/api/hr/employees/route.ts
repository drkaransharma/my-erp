import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { lastName: "asc" },
      include: { department: true, manager: true },
    });
    return NextResponse.json(employees);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.employee.count();
  const employeeCode = `EMP-${String(count + 1).padStart(3, "0")}`;
  const employee = await prisma.employee.create({
    data: { ...body, employeeCode, joinDate: new Date(body.joinDate), salary: body.salary || 0 },
    include: { department: true, manager: true },
  });
  return NextResponse.json(employee, { status: 201 });
}
