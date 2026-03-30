import { NextRequest, NextResponse } from "next/server";
import { generateTasksForUser } from "@/lib/task-generator";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const tasks = await generateTasksForUser(userId);
  return NextResponse.json(tasks);
}
