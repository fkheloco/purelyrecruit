import { db } from "@/db";
import { candidates, jobOpenings, applications, tenants } from "@/db/schema";
import { sql, eq, desc, gte } from "drizzle-orm";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { Users, Briefcase, FileText, Building2 } from "lucide-react";
import Link from "next/link";

export default async function RecruiterDashboard() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalCandidates] = await db.select({ count: sql<number>`count(*)` }).from(candidates);
  const [activeJobs] = await db.select({ count: sql<number>`count(*)` }).from(jobOpenings).where(eq(jobOpenings.status, "active"));
  const [recentApps] = await db.select({ count: sql<number>`count(*)` }).from(applications).where(gte(applications.appliedAt, sevenDaysAgo));
  const [totalTenants] = await db.select({ count: sql<number>`count(*)` }).from(tenants);

  const latestApps = await db.select().from(applications).orderBy(desc(applications.appliedAt)).limit(10);
  const latestJobs = await db.select().from(jobOpenings).orderBy(desc(jobOpenings.createdAt)).limit(5);

  return (
    <div>
      <PageHeader
        title="Recruiter Dashboard"
        description="Overview of your recruiting pipeline"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Candidates"
          value={Number(totalCandidates.count)}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Active Jobs"
          value={Number(activeJobs.count)}
          icon={<Briefcase className="h-5 w-5" />}
        />
        <StatCard
          label="Applications (7d)"
          value={Number(recentApps.count)}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Clients"
          value={Number(totalTenants.count)}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Applications</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {latestApps.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No applications yet</p>
            ) : (
              <div className="divide-y">
                {latestApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/recruiter/applications/${app.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application #{app.id.slice(0, 8)}</p>
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Latest Jobs</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {latestJobs.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No jobs yet</p>
            ) : (
              <div className="divide-y">
                {latestJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/recruiter/jobs/${job.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.department || "—"} · {job.locationType}</p>
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
