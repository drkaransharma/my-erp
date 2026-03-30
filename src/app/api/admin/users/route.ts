import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { lastName: "asc" },
      include: { role: true, department: true, reportsTo: true, directReports: true },
    });
    return NextResponse.json(users);
  } catch (err: any) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: err.message || "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, title, roleId, departmentId, reportsToId, status } = body;
  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  const user = await prisma.user.create({
    data: { firstName, lastName, email, title, roleId: roleId || null, departmentId: departmentId || null, reportsToId: reportsToId || null, status: status || "ACTIVE" },
    include: { role: true, department: true, reportsTo: true },
  });
  return NextResponse.json(user, { status: 201 });
}
