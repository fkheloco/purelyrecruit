"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tenants").then(r => r.json()).then(data => {
      setClients(data.data || []);
      setIsLoading(false);
    });
  }, []);

  const columns = [
    { key: "name", header: "Company", render: (item: any) => <span className="font-medium">{item.name}</span> },
    { key: "industry", header: "Industry", render: (item: any) => item.industry || "—" },
    { key: "slug", header: "Portal URL", render: (item: any) => <span className="font-mono text-xs text-gray-500">/{item.slug}/jobs</span> },
    { key: "isActive", header: "Status", render: (item: any) => item.isActive ? <span className="text-green-600 text-xs font-medium">Active</span> : <span className="text-gray-400 text-xs">Inactive</span> },
  ];

  return (
    <div>
      <PageHeader title="Clients" description="Manage tenant organizations" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <DataTable
          data={clients}
          columns={columns}
          onRowClick={(item) => router.push(`/recruiter/clients/${item.id}`)}
          emptyMessage="No clients yet."
        />
      )}
    </div>
  );
}
