"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ScoreBadge } from "@/components/shared/score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications").then(r => r.json()).then(data => {
      setApps(data.data || []);
      setIsLoading(false);
    });
  }, []);

  const columns = [
    { key: "id", header: "ID", render: (item: any) => <span className="font-mono text-xs">{item.id.slice(0, 8)}</span> },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
    { key: "source", header: "Source", render: (item: any) => <span className="text-xs capitalize">{item.source?.replace("_", " ")}</span> },
    { key: "finalScore", header: "AI Score", render: (item: any) => <ScoreBadge score={item.finalScore} /> },
    { key: "aiRecommendation", header: "Recommendation", render: (item: any) => item.aiRecommendation ? <span className="text-xs capitalize font-medium">{item.aiRecommendation.replace("_", " ")}</span> : "—" },
    { key: "appliedAt", header: "Applied", render: (item: any) => formatDate(item.appliedAt) },
  ];

  return (
    <div>
      <PageHeader title="Applications" description="Review and manage all candidate applications" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <DataTable
          data={apps}
          columns={columns}
          onRowClick={(item) => router.push(`/recruiter/applications/${item.id}`)}
          emptyMessage="No applications found."
        />
      )}
    </div>
  );
}
