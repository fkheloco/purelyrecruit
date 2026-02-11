import { db } from "@/db";
import { jobOpenings, applications, candidates } from "@/db/schema";
import { sql, eq, desc, gte } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function ClientDashboard() {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.org_id as string;

  if (!tenantId) {
    return <div className="text-center py-8 text-gray-500">Tenant information not found</div>;
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get active jobs
  const [activeJobsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobOpenings)
    .where(eq(jobOpenings.tenantId, tenantId));

  // Get total applicants for this client's jobs
  const jobIds = await db.select({ id: jobOpenings.id }).from(jobOpenings).where(eq(jobOpenings.tenantId, tenantId));
  const jobIdList = jobIds.map(j => j.id);

  const [totalApplicantsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(jobIdList.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIdList.map(id => `'${id}'`).join(','))})`
      : sql`1=0`
    );

  // Get average score
  const [avgScoreResult] = await db
    .select({ avg: sql<number>`AVG(${applications.finalScore})` })
    .from(applications)
    .where(jobIdList.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIdList.map(id => `'${id}'`).join(','))})`
      : sql`1=0`
    );

  // Get pending reviews
  const [pendingResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(jobIdList.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIdList.map(id => `'${id}'`).join(','))}) AND ${applications.status} = 'scored'`
      : sql`1=0`
    );

  // Get recent applications
  const recentApps = await db
    .select()
    .from(applications)
    .where(jobIdList.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIdList.map(id => `'${id}'`).join(','))})`
      : sql`1=0`
    )
    .orderBy(desc(applications.appliedAt))
    .limit(10);

  // Get active jobs list
  const activeJobs = await db
    .select()
    .from(jobOpenings)
    .where(eq(jobOpenings.tenantId, tenantId))
    .orderBy(desc(jobOpenings.createdAt))
    .limit(5);

  const activeJobsCount = Number(activeJobsResult.count) || 0;
  const totalApplicants = Number(totalApplicantsResult.count) || 0;
  const avgScore = avgScoreResult.avg ? Math.round(Number(avgScoreResult.avg)) : 0;
  const pendingReviews = Number(pendingResult.count) || 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your recruiting pipeline"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Jobs"
          value={activeJobsCount}
          icon={<Briefcase className="h-5 w-5" />}
        />
        <StatCard
          label="Total Applicants"
          value={totalApplicants}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Score"
          value={avgScore}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Reviews"
          value={pendingReviews}
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Applicants</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {recentApps.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No applicants yet</p>
            ) : (
              <div className="divide-y">
                {recentApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/client/candidates/${app.candidateId}?jobId=${app.jobOpeningId}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Candidate #{app.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScoreBadge score={app.finalScore} size="sm" />
                      <StatusBadge status={app.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Active Job Openings</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {activeJobs.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No active jobs</p>
            ) : (
              <div className="divide-y">
                {activeJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/client/jobs/${job.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">
                        {job.department || "—"} · {job.locationType}
                      </p>
                    </div>
                    <StatusBadge status={job.status} type="job" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
