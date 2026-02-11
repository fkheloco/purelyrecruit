import { db } from "@/db";
import { candidates, applications, jobOpenings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ClientCandidateDetailPage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.org_id as string;

  if (!tenantId) {
    return <div className="text-center py-8 text-gray-500">Tenant information not found</div>;
  }

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.id, candidateId))
    .limit(1);

  if (!candidate) notFound();

  // Get client's job IDs
  const clientJobs = await db
    .select({ id: jobOpenings.id })
    .from(jobOpenings)
    .where(eq(jobOpenings.tenantId, tenantId));

  const clientJobIds = clientJobs.map(j => j.id);

  // Get applications for this candidate in client's jobs
  const candidateApps = await db
    .select()
    .from(applications)
    .where(
      clientJobIds.length > 0
        ? eq(applications.candidateId, candidateId)
        : eq(applications.candidateId, candidateId)
    )
    .orderBy(desc(applications.appliedAt))
    .limit(20);

  // Filter to only client's jobs
  const filteredApps = candidateApps.filter(app =>
    clientJobIds.includes(app.jobOpeningId)
  );

  // Get job titles for applications
  const appsWithJobs = await Promise.all(
    filteredApps.map(async (app) => {
      const [job] = await db
        .select()
        .from(jobOpenings)
        .where(eq(jobOpenings.id, app.jobOpeningId))
        .limit(1);
      return { ...app, job };
    })
  );

  return (
    <div>
      <PageHeader
        title={`${candidate.firstName} ${candidate.lastName}`}
        description={candidate.email || ""}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Candidate Profile</h3>

            <div className="mt-6 space-y-4">
              {candidate.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <a href={`mailto:${candidate.email}`} className="text-sm text-blue-600 hover:underline">
                    {candidate.email}
                  </a>
                </div>
              )}

              {candidate.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <a href={`tel:${candidate.phone}`} className="text-sm text-blue-600 hover:underline">
                    {candidate.phone}
                  </a>
                </div>
              )}

              {(candidate.locationCity || candidate.locationState) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {candidate.locationCity && `${candidate.locationCity}, `}{candidate.locationState}
                  </span>
                </div>
              )}
            </div>

            {candidate.bio && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Summary</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{candidate.bio}</p>
              </>
            )}


            {candidate.yearsExperience && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Experience</h3>
                <p className="mt-3 text-sm text-gray-700">
                  {candidate.yearsExperience} years
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Overall Score</h3>
            <div className="mt-4">
              <ScoreBadge score={candidate.talentScore} />
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Applications ({appsWithJobs.length})
            </h3>
            <div className="mt-4 space-y-3">
              {appsWithJobs.length === 0 ? (
                <p className="text-sm text-gray-400">No applications for your jobs</p>
              ) : (
                appsWithJobs.map((app) => (
                  <Link
                    key={app.id}
                    href={`/client/jobs/${app.jobOpeningId}`}
                    className="block rounded-lg border p-3 hover:border-[#3CB3A2] transition"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {app.job?.title || "Unknown Job"}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={app.status} />
                      <ScoreBadge score={app.finalScore} size="sm" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Applied {formatDate(app.appliedAt)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
