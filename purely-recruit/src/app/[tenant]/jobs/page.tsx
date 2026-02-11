import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { jobOpenings, tenants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { SearchIcon, MapPinIcon, BriefcaseIcon, CalendarIcon } from "lucide-react";

interface TenantJobsPageProps {
  params: Promise<{
    tenant: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    location?: string;
    employment?: string;
  }>;
}

async function getTenant(slug: string) {
  const tenant = await db.select().from(tenants).where(eq(tenants.slug, slug));
  return tenant[0] || null;
}

async function getTenantJobs(
  tenantId: string,
  searchQuery?: string,
  locationFilter?: string,
  employmentFilter?: string
) {
  const conditions: any[] = [
    eq(jobOpenings.tenantId, tenantId),
    eq(jobOpenings.status, "active" as any),
  ];

  if (searchQuery) {
    conditions.push((jobOpenings.title as any).ilike(`%${searchQuery}%`));
  }

  if (locationFilter) {
    conditions.push(eq(jobOpenings.locationType, locationFilter as any));
  }

  if (employmentFilter) {
    conditions.push(eq(jobOpenings.employmentType, employmentFilter as any));
  }

  const jobs = await db
    .select({
      id: jobOpenings.id,
      title: jobOpenings.title,
      description: jobOpenings.description,
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
    .where(and(...conditions));

  return jobs;
}

async function TenantJobsList({
  tenantId,
  tenantSlug,
  searchQuery,
  locationFilter,
  employmentFilter,
}: {
  tenantId: string;
  tenantSlug: string;
  searchQuery?: string;
  locationFilter?: string;
  employmentFilter?: string;
}) {
  const jobs = await getTenantJobs(tenantId, searchQuery, locationFilter, employmentFilter);

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No positions available</h3>
        <p className="text-gray-600">
          {searchQuery
            ? "Try adjusting your search terms"
            : "Check back soon for open opportunities"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job: any) => (
        <Link
          key={job.id}
          href={`/${tenantSlug}/jobs/${job.id}`}
          className="block rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>

              {job.department && (
                <p className="text-sm text-gray-600 mb-3">{job.department}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {job.locationCity && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                    <MapPinIcon className="h-3 w-3" />
                    {job.locationCity}, {job.locationState}
                  </span>
                )}

                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-purple-700">
                  <BriefcaseIcon className="h-3 w-3" />
                  {job.employmentType?.replace(/_/g, " ")}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                  {job.locationType?.replace(/_/g, " ")}
                </span>

                {job.salaryMin && job.salaryMax && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-green-700">
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-sm text-gray-500 whitespace-nowrap">
              <div className="flex items-center justify-end gap-1">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(job.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function TenantJobsPage({
  params,
  searchParams,
}: TenantJobsPageProps) {
  const { tenant } = await params;
  const search = await searchParams;

  const tenantData = await getTenant(tenant);

  if (!tenantData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Positions at {tenantData?.name}</h1>
        <p className="text-gray-600">
          {tenantData?.description || "Explore career opportunities with us"}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row mb-6">
          <form method="get" className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="q"
              placeholder="Search by job title or keywords..."
              defaultValue={search?.q || ""}
              className="flex-1 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="rounded px-3 py-1 text-sm font-semibold text-white transition"
              style={{ backgroundColor: tenantData?.primaryColor || "#455E7F" }}
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <form method="get">
              <input type="hidden" name="q" value={search?.q || ""} />
              <select
                name="location"
                defaultValue={search?.location || ""}
                onChange={(e) => e.currentTarget.form?.submit()}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": (tenantData?.primaryColor || "#455E7F") + "40" } as any}
              >
                <option value="">All Locations</option>
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <form method="get">
              <input type="hidden" name="q" value={search?.q || ""} />
              <select
                name="employment"
                defaultValue={search?.employment || ""}
                onChange={(e) => e.currentTarget.form?.submit()}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": (tenantData?.primaryColor || "#455E7F") + "40" } as any}
              >
                <option value="">All Types</option>
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="temp">Temporary</option>
                <option value="intern">Internship</option>
              </select>
            </form>
          </div>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <TenantJobsList
          tenantId={tenantData.id}
          tenantSlug={tenant}
          searchQuery={search?.q}
          locationFilter={search?.location}
          employmentFilter={search?.employment}
        />
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse"
        />
      ))}
    </div>
  );
}
