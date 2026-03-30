import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: { head: true, _count: { select: { users: true } } },
  });
  return NextResponse.json(departments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, headId } = body;
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const department = await prisma.department.create({ data: { name, description, headId: headId || null } });
  return NextResponse.json(department, { status: 201 });
}
