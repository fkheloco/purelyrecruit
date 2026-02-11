import { db } from "@/db";
import { candidates, applications, jobOpenings } from "@/db/schema";
import { sql, eq, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CheckCircle, MessageSquare, Briefcase, BarChart3 } from "lucide-react";
import Link from "next/link";

async function getCandidateData(userId: string) {
  // Get candidate record
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.userId, userId))
    .limit(1);

  if (!candidate) return null;

  // Get application stats
  const [activeApps] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, candidate.id),
        sql`status NOT IN ('rejected', 'withdrawn', 'hired')`
      )
    );

  const [interviews] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, candidate.id),
        sql`status IN ('interviewing', 'offered')`
      )
    );

  const [totalApps] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(eq(applications.candidateId, candidate.id));

  // Calculate profile completeness
  const profileFields = [
    candidate.firstName,
    candidate.lastName,
    candidate.phone,
    candidate.locationCity,
    candidate.linkedinUrl,
    candidate.bio,
    candidate.currentTitle,
  ];
  const completeness = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100
  );

  // Get recent application updates
  const recentApps = await db
    .select({
      id: applications.id,
      status: applications.status,
      appliedAt: applications.appliedAt,
      jobOpeningId: applications.jobOpeningId,
    })
    .from(applications)
    .where(eq(applications.candidateId, candidate.id))
    .orderBy(desc(applications.updatedAt))
    .limit(5);

  // Get recommended jobs (same industries/titles if available)
  const recommendedJobs = await db
    .select()
    .from(jobOpenings)
    .where(
      and(
        eq(jobOpenings.status, "active"),
        sql`${jobOpenings.id} NOT IN (
          SELECT ${applications.jobOpeningId}
          FROM ${applications}
          WHERE ${eq(applications.candidateId, candidate.id)}
        )`
      )
    )
    .orderBy(desc(jobOpenings.createdAt))
    .limit(4);

  return {
    candidate,
    activeAppsCount: Number(activeApps.count),
    interviewsCount: Number(interviews.count),
    totalAppsCount: Number(totalApps.count),
    profileCompleteness: completeness,
    recentApps,
    recommendedJobs,
  };
}

export default async function CandidateDashboard() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please sign in to continue</p>
      </div>
    );
  }

  const data = await getCandidateData(userId);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Welcome! Complete your profile to get started</p>
      </div>
    );
  }

  const { candidate, activeAppsCount, interviewsCount, profileCompleteness, recentApps, recommendedJobs } = data;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${candidate.firstName || "Candidate"}!`}
        description="Track your applications and opportunities"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Applications"
          value={activeAppsCount}
          icon={<Briefcase className="h-5 w-5 text-[#3CB3A2]" />}
        />
        <StatCard
          label="Interviews Scheduled"
          value={interviewsCount}
          icon={<MessageSquare className="h-5 w-5 text-[#3CB3A2]" />}
        />
        <StatCard
          label="Profile Completeness"
          value={`${profileCompleteness}%`}
          icon={<BarChart3 className="h-5 w-5 text-[#3CB3A2]" />}
        />
        <StatCard
          label="Total Applications"
          value={data.totalAppsCount}
          icon={<CheckCircle className="h-5 w-5 text-[#3CB3A2]" />}
        />
      </div>

      {profileCompleteness < 100 && (
        <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">Complete Your Profile</h3>
              <p className="mt-1 text-sm text-amber-700">
                A complete profile increases your chances of being matched with great opportunities.
              </p>
            </div>
            <Link
              href="/candidate/profile"
              className="whitespace-nowrap px-4 py-2 text-sm font-medium text-white bg-[#3CB3A2] rounded hover:bg-[#35a096] transition"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Application Updates</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {recentApps.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No applications yet</p>
            ) : (
              <div className="divide-y">
                {recentApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/candidate/applications/${app.id}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Application #{app.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recommended Jobs</h2>
          <div className="rounded-lg border bg-white shadow-sm">
            {recommendedJobs.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No jobs available at the moment</p>
            ) : (
              <div className="divide-y">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/candidate/jobs/${job.id}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.locationCity && job.locationState
                        ? `${job.locationCity}, ${job.locationState}`
                        : "Remote"}{" "}
                      · {job.locationType}
                    </p>
                    {job.salaryMin && job.salaryMax && (
                      <p className="text-xs text-gray-600 mt-2">
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </p>
                    )}
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
