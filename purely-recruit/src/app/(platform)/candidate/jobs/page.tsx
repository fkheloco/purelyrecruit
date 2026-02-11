"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loader2, MapPin, DollarSign, Briefcase } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  department?: string;
  locationCity?: string;
  locationState?: string;
  locationType: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  createdAt: string;
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs?status=active");
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const locationMatch =
      !locationFilter ||
      (job.locationCity
        ?.toLowerCase()
        .includes(locationFilter.toLowerCase()) &&
        job.locationState
          ?.toLowerCase()
          .includes(locationFilter.toLowerCase())) ||
      job.locationType.toLowerCase().includes(locationFilter.toLowerCase());

    const typeMatch =
      !typeFilter || job.employmentType === typeFilter;

    return searchMatch && locationMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CB3A2]" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Job Board"
        description="Explore available opportunities"
      />

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by job title or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
        >
          <option value="">All Employment Types</option>
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="temp">Temporary</option>
          <option value="intern">Internship</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No jobs match your filters</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/candidate/jobs/${job.id}`}
              className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:border-[#3CB3A2] transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>

              {job.department && (
                <p className="text-sm text-gray-600 mb-4">{job.department}</p>
              )}

              <div className="space-y-2 mb-4">
                {(job.locationCity || job.locationState) && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-[#3CB3A2]" />
                    <span>
                      {job.locationCity && job.locationState
                        ? `${job.locationCity}, ${job.locationState}`
                        : "Remote"}{" "}
                      · {job.locationType}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Briefcase className="h-4 w-4 text-[#3CB3A2]" />
                  <span className="capitalize">
                    {job.employmentType.replace("_", " ")}
                  </span>
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DollarSign className="h-4 w-4 text-[#3CB3A2]" />
                    <span>
                      ${job.salaryMin.toLocaleString()} - $
                      {job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {job.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {job.description}
                </p>
              )}

              <button className="w-full px-4 py-2 bg-[#3CB3A2] text-white font-medium rounded-lg hover:bg-[#35a096] transition">
                View & Apply
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
