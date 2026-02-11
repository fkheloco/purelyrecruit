"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Application {
  id: string;
  jobOpeningId: string;
  status: string;
  finalScore: number | null;
  appliedAt: string;
}

interface JobDetails {
  id: string;
  title: string;
  company?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobDetails, setJobDetails] = useState<Record<string, JobDetails>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(data.data || []);

      // Fetch job details for each application
      const jobs: Record<string, JobDetails> = {};
      for (const app of data.data || []) {
        const jobRes = await fetch(`/api/jobs/${app.jobOpeningId}`);
        if (jobRes.ok) {
          const jobData = await jobRes.json();
          jobs[app.jobOpeningId] = jobData.data;
        }
      }
      setJobDetails(jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
        title="My Applications"
        description="Track all your job applications"
      />

      <div className="rounded-lg border bg-white shadow-sm">
        {applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No applications yet</p>
            <Link
              href="/candidate/jobs"
              className="inline-block px-6 py-2 bg-[#3CB3A2] text-white font-medium rounded-lg hover:bg-[#35a096] transition"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => {
                  const job = jobDetails[app.jobOpeningId];
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {job?.title || "Loading..."}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        {app.finalScore !== null ? (
                          <ScoreBadge score={app.finalScore} size="sm" />
                        ) : (
                          <span className="text-xs text-gray-500">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/candidate/applications/${app.id}`}
                          className="text-sm font-medium text-[#3CB3A2] hover:text-[#35a096] transition"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
