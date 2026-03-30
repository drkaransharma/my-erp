import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  const where = type ? { type: type as any } : {};

  const accounts = await prisma.account.findMany({
    where,
    orderBy: { code: "asc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { code, name, type, subtype, description, parentId } = body;

  if (!code || !name || !type) {
    return NextResponse.json({ error: "Code, name, and type are required" }, { status: 400 });
  }

  const existing = await prisma.account.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "Account code already exists" }, { status: 409 });
  }

  const account = await prisma.account.create({
    data: { code, name, type, subtype, description, parentId },
  });

  return NextResponse.json(account, { status: 201 });
}
