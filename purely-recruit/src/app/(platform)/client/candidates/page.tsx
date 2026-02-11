"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

export default function ClientCandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/candidates")
      .then(r => r.json())
      .then(data => {
        setCandidates(data.data || []);
        setIsLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter(c =>
    c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: any) => (
        <div>
          <p className="font-medium">
            {item.firstName} {item.lastName}
          </p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item: any) => <span className="text-sm">{item.phone || "—"}</span>
    },
    {
      key: "finalScore",
      header: "Score",
      render: (item: any) => <ScoreBadge score={item.finalScore} size="sm" />
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.latestApplicationStatus || "new"} />
    },
    {
      key: "appliedAt",
      header: "Applied",
      render: (item: any) => formatDate(item.appliedAt)
    },
  ];

  return (
    <div>
      <PageHeader title="Candidates" description="View all applicants to your jobs" />

      <div className="mb-6 flex items-center gap-3 rounded-lg border bg-white px-4 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-0 flex-1"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredCandidates}
          columns={columns}
          onRowClick={(item) => router.push(`/client/candidates/${item.id}`)}
          emptyMessage={
            searchTerm
              ? "No candidates match your search"
              : "No candidates have applied yet"
          }
        />
      )}
    </div>
  );
}
