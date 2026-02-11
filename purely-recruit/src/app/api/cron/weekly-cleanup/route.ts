import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobQueue } from "@/db/schema";
import { eq, lt } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await db.delete(jobQueue).where(
    lt(jobQueue.completedAt, thirtyDaysAgo)
  );

  return NextResponse.json({ message: "Weekly cleanup completed" });
}
