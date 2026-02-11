import { db } from "@/db";
import { jobOpenings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthContext } from "@/lib/auth/middleware";
import { PageHeader } from "@/components/shared/page-header";
import { MapPin, DollarSign, Briefcase, Building2 } from "lucide-react";
import JobApplyButton from "./apply-button";

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  const context = await getAuthContext();

  const [job] = await db
    .select()
    .from(jobOpenings)
    .where(eq(jobOpenings.id, params.jobId))
    .limit(1);

  if (!job) {
    return <div className="text-center py-12">Job not found</div>;
  }

  return (
    <div>
      <PageHeader
        title={job.title}
        description={job.department || ""}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            {/* Key Details Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {job.locationCity && job.locationState && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-xs font-medium text-gray-500">Location</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {job.locationCity}, {job.locationState}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {job.locationType}
                  </p>
                </div>
              )}

              {job.employmentType && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Briefcase className="h-4 w-4" />
                    <p className="text-xs font-medium text-gray-500">Type</p>
                  </div>
                  <p className="font-medium text-gray-900 capitalize">
                    {job.employmentType.replace("_", " ")}
                  </p>
                </div>
              )}

              {job.salaryMin && job.salaryMax && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <p className="text-xs font-medium text-gray-500">Salary</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${job.salaryMin.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    to ${job.salaryMax.toLocaleString()}
                  </p>
                </div>
              )}

              {job.department && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="h-4 w-4" />
                    <p className="text-xs font-medium text-gray-500">
                      Department
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">{job.department}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-8 space-y-8">
              {/* Description */}
              {job.description && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    About the Role
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Requirements
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Good Indicators */}
              {job.goodIndicators && job.goodIndicators.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    What We're Looking For
                  </h2>
                  <ul className="space-y-2">
                    {job.goodIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bad Indicators */}
              {job.badIndicators && job.badIndicators.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Deal Breakers
                  </h2>
                  <ul className="space-y-2">
                    {job.badIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 flex-shrink-0 mt-0.5">
                          ✗
                        </span>
                        <span className="text-gray-700">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-lg border bg-white p-6 shadow-sm sticky top-8">
            <JobApplyButton
              jobId={job.id}
              jobTitle={job.title}
              candidateId={context?.userId}
            />

            <div className="mt-6 space-y-4 border-t pt-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Posted
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>

              {job.closesAt && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Application Closes
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(job.closesAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
