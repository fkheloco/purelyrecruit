import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, jobOpenings, candidates } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const tenantId = context.tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalJobs] = await db.select({ count: sql<number>`count(*)` })
    .from(jobOpenings).where(eq(jobOpenings.tenantId, tenantId));

  const [activeJobs] = await db.select({ count: sql<number>`count(*)` })
    .from(jobOpenings).where(and(eq(jobOpenings.tenantId, tenantId), eq(jobOpenings.status, "active")));

  const [totalApps] = await db.select({ count: sql<number>`count(*)` })
    .from(applications).where(eq(applications.tenantId, tenantId));

  const [recentApps] = await db.select({ count: sql<number>`count(*)` })
    .from(applications).where(and(eq(applications.tenantId, tenantId), gte(applications.appliedAt, thirtyDaysAgo)));

  const [avgScore] = await db.select({ avg: sql<number>`avg(final_score)` })
    .from(applications).where(eq(applications.tenantId, tenantId));

  return NextResponse.json({
    data: {
      totalJobs: Number(totalJobs.count),
      activeJobs: Number(activeJobs.count),
      totalApplications: Number(totalApps.count),
      recentApplications: Number(recentApps.count),
      averageScore: Math.round(Number(avgScore.avg || 0) * 100) / 100,
    },
  });
}
