import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });
  return NextResponse.json(roles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, permissions } = body;
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const role = await prisma.role.create({ data: { name, description, permissions: permissions || {} } });
  return NextResponse.json(role, { status: 201 });
}
