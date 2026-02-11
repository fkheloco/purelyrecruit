import { db } from "@/db";
import { applications, jobOpenings, candidates, tenants } from "@/db/schema";
import { sql, eq, gte } from "drizzle-orm";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";

export default async function AnalyticsPage() {
  const [totalCandidates] = await db.select({ count: sql<number>`count(*)` }).from(candidates);
  const [totalJobs] = await db.select({ count: sql<number>`count(*)` }).from(jobOpenings);
  const [totalApps] = await db.select({ count: sql<number>`count(*)` }).from(applications);
  const [totalTenants] = await db.select({ count: sql<number>`count(*)` }).from(tenants);
  const [avgScore] = await db.select({ avg: sql<number>`avg(final_score)` }).from(applications);
  const [scoredApps] = await db.select({ count: sql<number>`count(*)` }).from(applications).where(eq(applications.status, "scored"));

  return (
    <div>
      <PageHeader title="Analytics" description="Platform-wide metrics and insights" />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Candidates" value={Number(totalCandidates.count)} />
        <StatCard label="Total Job Openings" value={Number(totalJobs.count)} />
        <StatCard label="Total Applications" value={Number(totalApps.count)} />
        <StatCard label="Active Clients" value={Number(totalTenants.count)} />
        <StatCard label="Average AI Score" value={Math.round(Number(avgScore.avg || 0))} />
        <StatCard label="AI Scored" value={Number(scoredApps.count)} />
      </div>
    </div>
  );
}
