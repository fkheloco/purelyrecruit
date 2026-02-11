import { db } from "@/db";
import { jobOpenings, applications, candidates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, jobId)).limit(1);
  if (!job) notFound();

  const jobApps = await db.select().from(applications)
    .where(eq(applications.jobOpeningId, jobId))
    .orderBy(desc(applications.finalScore))
    .limit(50);

  return (
    <div>
      <PageHeader title={job.title} description={`${job.department || ""} · ${job.locationType}`}>
        <StatusBadge status={job.status} type="job" />
      </PageHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{job.description || "No description"}</p>

            {job.requirements && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Requirements</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{job.requirements}</p>
              </>
            )}

            {job.goodIndicators && job.goodIndicators.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Good Indicators</h3>
                <ul className="mt-2 space-y-1">
                  {job.goodIndicators.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                      <span className="text-green-500">✓</span> {g}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {job.badIndicators && job.badIndicators.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Red Flags</h3>
                <ul className="mt-2 space-y-1">
                  {job.badIndicators.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                      <span className="text-red-500">✕</span> {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Employment</dt>
                <dd className="font-medium capitalize">{job.employmentType?.replace("_", " ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium">{job.locationCity ? `${job.locationCity}, ${job.locationState}` : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Salary</dt>
                <dd className="font-medium">{job.salaryMin ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Posted</dt>
                <dd className="font-medium">{formatDate(job.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Applicants ({jobApps.length})</h3>
            <div className="mt-4 divide-y">
              {jobApps.length === 0 ? (
                <p className="text-sm text-gray-400">No applicants yet</p>
              ) : (
                jobApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/recruiter/applications/${app.id}`}
                    className="flex items-center justify-between py-3 hover:text-[#455E7F]"
                  >
                    <div className="text-sm">
                      <StatusBadge status={app.status} />
                    </div>
                    <ScoreBadge score={app.finalScore} size="sm" />
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
