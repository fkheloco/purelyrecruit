import { db } from "@/db";
import { jobOpenings, applications } from "@/db/schema";
import { eq, sql, gte } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { BarChart3, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default async function ClientReportsPage() {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.org_id as string;

  if (!tenantId) {
    return <div className="text-center py-8 text-gray-500">Tenant information not found</div>;
  }

  // Get client's job IDs
  const clientJobs = await db
    .select({ id: jobOpenings.id, createdAt: jobOpenings.createdAt })
    .from(jobOpenings)
    .where(eq(jobOpenings.tenantId, tenantId));

  const jobIds = clientJobs.map(j => j.id);

  // Total applicants
  const [totalApplicantsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(jobIds.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIds.map(id => `'${id}'`).join(','))})`
      : sql`1=0`
    );

  // Shortlisted count
  const [shortlistedResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(jobIds.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIds.map(id => `'${id}'`).join(','))}) AND ${applications.status} IN ('shortlisted', 'interviewing', 'offered', 'hired')`
      : sql`1=0`
    );

  // Hired count
  const [hiredResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(jobIds.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIds.map(id => `'${id}'`).join(','))}) AND ${applications.status} = 'hired'`
      : sql`1=0`
    );

  // Average time to shortlist (in days)
  const [avgTimeResult] = await db
    .select({ avgDays: sql<number>`AVG(EXTRACT(DAY FROM (${applications.updatedAt} - ${applications.appliedAt})))` })
    .from(applications)
    .where(jobIds.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIds.map(id => `'${id}'`).join(','))}) AND ${applications.status} IN ('shortlisted', 'interviewing', 'offered', 'hired')`
      : sql`1=0`
    );

  // Score distribution
  const [scoreDistribution] = await db
    .select({
      excellent: sql<number>`count(*) FILTER (WHERE ${applications.finalScore} >= 85)`,
      strong: sql<number>`count(*) FILTER (WHERE ${applications.finalScore} >= 70 AND ${applications.finalScore} < 85)`,
      good: sql<number>`count(*) FILTER (WHERE ${applications.finalScore} >= 55 AND ${applications.finalScore} < 70)`,
      fair: sql<number>`count(*) FILTER (WHERE ${applications.finalScore} >= 40 AND ${applications.finalScore} < 55)`,
      weak: sql<number>`count(*) FILTER (WHERE ${applications.finalScore} < 40)`,
    })
    .from(applications)
    .where(jobIds.length > 0
      ? sql`${applications.jobOpeningId} IN (${sql.raw(jobIds.map(id => `'${id}'`).join(','))})`
      : sql`1=0`
    );

  const totalApplicants = Number(totalApplicantsResult.count) || 0;
  const shortlisted = Number(shortlistedResult.count) || 0;
  const hired = Number(hiredResult.count) || 0;
  const avgDaysToShortlist = avgTimeResult.avgDays ? Math.round(Number(avgTimeResult.avgDays)) : 0;
  const conversionRate = totalApplicants > 0 ? ((shortlisted / totalApplicants) * 100).toFixed(1) : 0;

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="View performance metrics and hiring insights"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applicants"
          value={totalApplicants}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Days to Shortlist"
          value={avgDaysToShortlist}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Score Distribution */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Score Distribution</h2>
          <div className="rounded-lg border bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Excellent (85+)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${totalApplicants > 0 ? (Number(scoreDistribution.excellent) / totalApplicants) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {scoreDistribution.excellent}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600">Strong (70-84)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${totalApplicants > 0 ? (Number(scoreDistribution.strong) / totalApplicants) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {scoreDistribution.strong}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Good (55-69)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${totalApplicants > 0 ? (Number(scoreDistribution.good) / totalApplicants) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {scoreDistribution.good}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-600">Fair (40-54)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${totalApplicants > 0 ? (Number(scoreDistribution.fair) / totalApplicants) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {scoreDistribution.fair}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Weak (&lt;40)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${totalApplicants > 0 ? (Number(scoreDistribution.weak) / totalApplicants) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {scoreDistribution.weak}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h2>
          <div className="rounded-lg border bg-white p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hired</span>
                <span className="text-2xl font-semibold text-gray-900">{hired}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {totalApplicants > 0 ? ((hired / totalApplicants) * 100).toFixed(1) : 0}% of applicants hired
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pipeline Health</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {conversionRate}%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Conversion from application to shortlist
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Quality Score</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {totalApplicants > 0
                    ? Math.round(
                        (Number(scoreDistribution.excellent) * 90 +
                          Number(scoreDistribution.strong) * 77 +
                          Number(scoreDistribution.good) * 62 +
                          Number(scoreDistribution.fair) * 47 +
                          Number(scoreDistribution.weak) * 20) /
                          totalApplicants
                      )
                    : 0}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Weighted average candidate score
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
