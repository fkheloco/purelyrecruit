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

interface TenantJobDetailPageProps {
  params: Promise<{
    tenant: string;
    jobId: string;
  }>;
}

async function getTenant(slug: string) {
  const tenant = await db.select().from(tenants).where(eq(tenants.slug, slug));
  return tenant[0] || null;
}

async function getJobDetail(jobId: string, tenantId: string) {
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
    })
    .from(jobOpenings)
    .where(and(
      eq(jobOpenings.id, jobId),
      eq(jobOpenings.tenantId, tenantId),
      eq(jobOpenings.status, "active" as any)
    ));

  return job[0] || null;
}

export default async function TenantJobDetailPage({
  params,
}: TenantJobDetailPageProps) {
  const { tenant, jobId } = await params;
  const { userId } = await auth();

  const tenantData = await getTenant(tenant);
  if (!tenantData) {
    notFound();
  }

  const job = await getJobDetail(jobId, tenantData.id);
  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${tenant}/jobs`}
        className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition"
        style={{ color: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Open Positions
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            {tenantData.logoUrl && (
              <img
                src={tenantData.logoUrl}
                alt={tenantData.name}
                className="h-12 w-12 rounded-lg object-cover mb-4"
              />
            )}

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
                <div className="flex items-center gap-1 font-medium" style={{ color: tenantData?.accentColor || "#D7A839" } as React.CSSProperties}>
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
            href={userId ? `/${tenant}/apply/${jobId}` : "/sign-up"}
            className="rounded-lg px-6 py-3 font-semibold text-white hover:opacity-90 transition whitespace-nowrap"
            style={{ backgroundColor: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
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
                  <CheckCircleIcon
                    className="h-5 w-5 flex-shrink-0 mt-0.5"
                    style={{ color: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
                  />
                  <span className="text-gray-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-lg p-6" style={{ backgroundColor: (tenantData?.primaryColor || "#455E7F") + "10" } as React.CSSProperties}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">About {tenantData?.name}</h2>
          <div className="text-gray-700 mb-4">
            {tenantData?.description ? (
              <p>{tenantData.description}</p>
            ) : (
              <p className="text-gray-500 italic">Company details coming soon</p>
            )}
          </div>
          {tenantData?.website && (
            <Link
              href={tenantData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition"
              style={{ color: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
            >
              Visit {tenantData?.name} →
            </Link>
          )}
        </section>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to join our team?</h3>
          <p className="text-gray-600 mb-6">
            {userId
              ? "Submit your application and let us know why you'd be a great fit!"
              : "Create an account to submit your application."}
          </p>
          <Link
            href={userId ? `/${tenant}/apply/${jobId}` : "/sign-up"}
            className="inline-block rounded-lg px-8 py-3 font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
          >
            {userId ? "Start Application" : "Sign Up to Apply"}
          </Link>
        </div>
      </div>
    </div>
  );
}
