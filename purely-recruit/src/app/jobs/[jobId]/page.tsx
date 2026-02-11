import { notFound } from "next/navigation";
import { db } from "@/db";
import { jobOpenings, tenants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";

interface JobDetailPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

async function getJobDetail(jobId: string) {
  const job = await db
    .select({
      id: jobOpenings.id,
      title: jobOpenings.title,
      description: jobOpenings.description,
      requirements: jobOpenings.requirements,
      goodIndicators: jobOpenings.goodIndicators,
      locationCity: jobOpenings.locationCity,
      locationState: jobOpenings.locationState,
      locationType: jobOpenings.locationType,
      employmentType: jobOpenings.employmentType,
      salaryMin: jobOpenings.salaryMin,
      salaryMax: jobOpenings.salaryMax,
      department: jobOpenings.department,
      createdAt: jobOpenings.createdAt,
      tenantId: jobOpenings.tenantId,
      tenantName: tenants.name,
      tenantLogoUrl: tenants.logoUrl,
      tenantWebsite: tenants.website,
      tenantDescription: tenants.description,
    })
    .from(jobOpenings)
    .innerJoin(tenants, eq(jobOpenings.tenantId, tenants.id))
    .where(and(
      eq(jobOpenings.id, jobId),
      eq(jobOpenings.status, "active" as any)
    ));

  return job[0] || null;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params;
  const { userId } = await auth();
  const job = await getJobDetail(jobId);

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#455E7F] hover:text-[#3a5170] mb-8"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Job Board
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {job.tenantLogoUrl && (
                <img
                  src={job.tenantLogoUrl}
                  alt={job.tenantName}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">{job.tenantName}</p>
                {job.department && (
                  <p className="text-xs text-gray-500">{job.department}</p>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              {job.locationCity && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  {job.locationCity}, {job.locationState}
                </div>
              )}

              <div className="flex items-center gap-1 text-gray-600">
                <BriefcaseIcon className="h-4 w-4" />
                {job.employmentType?.replace(/_/g, " ")}
              </div>

              <div className="flex items-center gap-1 text-gray-600">
                {job.locationType?.replace(/_/g, " ")}
              </div>

              {job.salaryMin && job.salaryMax && (
                <div className="flex items-center gap-1 text-green-700 font-medium">
                  <DollarSignIcon className="h-4 w-4" />
                  {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                </div>
              )}

              <div className="flex items-center gap-1 text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                Posted {formatDate(job.createdAt)}
              </div>
            </div>
          </div>

          <Link
            href={userId ? `/jobs/${jobId}/apply` : "/sign-up"}
            className="rounded-lg bg-[#3CB3A2] px-6 py-3 font-semibold text-white hover:bg-[#2a9683] transition whitespace-nowrap"
          >
            Apply Now
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Role</h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            {job.description ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {job.description}
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>
        </section>

        {job.requirements && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {job.requirements}
              </div>
            </div>
          </section>
        )}

        {job.goodIndicators && job.goodIndicators.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">What We're Looking For</h2>
            <ul className="space-y-2">
              {job.goodIndicators?.map((indicator: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-[#3CB3A2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-lg bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">About {job.tenantName}</h2>
          <div className="text-gray-700 mb-4">
            {job.tenantDescription ? (
              <p>{job.tenantDescription}</p>
            ) : (
              <p className="text-gray-500 italic">Company details coming soon</p>
            )}
          </div>
          {job.tenantWebsite && (
            <Link
              href={job.tenantWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#455E7F] hover:underline font-medium"
            >
              Visit {job.tenantName} →
            </Link>
          )}
        </section>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to apply?</h3>
          <p className="text-gray-600 mb-6">
            {userId
              ? "Submit your application and let us know why you'd be a great fit!"
              : "Create an account or sign in to apply for this position."}
          </p>
          <Link
            href={userId ? `/jobs/${jobId}/apply` : "/sign-up"}
            className="inline-block rounded-lg bg-[#3CB3A2] px-8 py-3 font-semibold text-white hover:bg-[#2a9683] transition"
          >
            {userId ? "Start Application" : "Sign Up to Apply"}
          </Link>
        </div>
      </div>
    </div>
  );
}
