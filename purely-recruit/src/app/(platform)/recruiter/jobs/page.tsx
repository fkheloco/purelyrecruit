"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function JobsPage() {
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
    { key: "locationType", header: "Type", render: (item: any) => <span className="capitalize">{item.locationType?.replace("_", " ")}</span> },
    { key: "salary", header: "Salary", render: (item: any) => item.salaryMin ? `${formatCurrency(item.salaryMin)} - ${formatCurrency(item.salaryMax)}` : "—" },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.status} type="job" /> },
    { key: "createdAt", header: "Posted", render: (item: any) => formatDate(item.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Job Openings" description="Manage all job postings across clients">
        <button
          onClick={() => router.push("/recruiter/jobs?new=true")}
          className="flex items-center gap-2 rounded-lg bg-[#455E7F] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a5170] transition"
        >
          <Plus className="h-4 w-4" /> New Job
        </button>
      </PageHeader>

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
          onRowClick={(item) => router.push(`/recruiter/jobs/${item.id}`)}
          emptyMessage="No jobs found. Create your first job posting."
        />
      )}
    </div>
  );
}
