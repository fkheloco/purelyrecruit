import { Suspense } from "react";
import { db } from "@/db";
import { jobOpenings, tenants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { SearchIcon, MapPinIcon, BriefcaseIcon, CalendarIcon } from "lucide-react";
import { SearchFilters } from "./search-filters";

async function getPublishedJobs(searchQuery?: string, locationFilter?: string, employmentFilter?: string) {
  // Build conditions array
  const conditions: any[] = [eq(jobOpenings.status, "active")];

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
      createdAt: jobOpenings.createdAt,
      tenantId: jobOpenings.tenantId,
      tenantName: tenants.name,
      tenantLogoUrl: tenants.logoUrl,
    })
    .from(jobOpenings)
    .innerJoin(tenants, eq(jobOpenings.tenantId, tenants.id))
    .where(and(...conditions));

  return jobs;
}

interface JobListProps {
  searchParams?: {
    q?: string;
    location?: string;
    employment?: string;
  };
}

async function JobsList({ searchParams }: JobListProps) {
  const jobs = await getPublishedJobs(
    searchParams?.q,
    searchParams?.location,
    searchParams?.employment
  );

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">
          {searchParams?.q
            ? "Try adjusting your search terms"
            : "Check back soon for new opportunities"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="block rounded-lg border border-gray-200 bg-white p-6 hover:border-[#3CB3A2] hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="font-medium text-gray-700">{job.tenantName}</span>
                {job.locationCity && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {job.locationCity}, {job.locationState}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                  <BriefcaseIcon className="h-3 w-3" />
                  {job.employmentType?.replace(/_/g, " ")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-purple-700">
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

export default function JobsPage({ searchParams }: JobListProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Open Positions</h1>
        <p className="text-gray-600">Explore opportunities across our network of partner companies</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <form method="get" className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Search jobs by title, company, or keywords..."
                defaultValue={searchParams?.q || ""}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#455E7F] focus:ring-1 focus:ring-[#455E7F]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#455E7F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a5170] transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <SearchFilters />
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <JobsList searchParams={searchParams} />
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
