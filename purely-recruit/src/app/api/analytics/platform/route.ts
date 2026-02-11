import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, jobOpenings, candidates, tenants } from "@/db/schema";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter");
  if (roleCheck) return roleCheck;

  const [totalCandidates] = await db.select({ count: sql<number>`count(*)` }).from(candidates);
  const [totalJobs] = await db.select({ count: sql<number>`count(*)` }).from(jobOpenings);
  const [totalApps] = await db.select({ count: sql<number>`count(*)` }).from(applications);
  const [totalTenants] = await db.select({ count: sql<number>`count(*)` }).from(tenants);
  const [avgScore] = await db.select({ avg: sql<number>`avg(final_score)` }).from(applications);

  return NextResponse.json({
    data: {
      totalCandidates: Number(totalCandidates.count),
      totalJobs: Number(totalJobs.count),
      totalApplications: Number(totalApps.count),
      totalTenants: Number(totalTenants.count),
      averageScore: Math.round(Number(avgScore.avg || 0) * 100) / 100,
    },
  });
}
