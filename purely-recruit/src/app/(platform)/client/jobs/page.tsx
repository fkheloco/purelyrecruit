"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function ClientJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs").then(r => r.json()).then(data => {
      setJobs(data.data || []);
      setIsLoading(false);
    });
  }, []);

  const columns = [
    {
      key: "title",
      header: "Job Title",
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">{item.department || "—"}</p>
        </div>
      ),
    },
    {
      key: "locationType",
      header: "Type",
      render: (item: any) => <span className="capitalize">{item.locationType?.replace("_", " ")}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.status} type="job" />
    },
    {
      key: "applicantCount",
      header: "Applicants",
      render: (item: any) => <span className="font-medium">{item.applicantCount || 0}</span>
    },
    {
      key: "createdAt",
      header: "Posted",
      render: (item: any) => formatDate(item.createdAt)
    },
  ];

  return (
    <div>
      <PageHeader title="Job Openings" description="Manage your job postings and applicants" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <DataTable
          data={jobs}
          columns={columns}
          onRowClick={(item) => router.push(`/client/jobs/${item.id}`)}
          emptyMessage="No jobs found"
        />
      )}
    </div>
  );
}
