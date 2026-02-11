"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ScoreBadge } from "@/components/shared/score-badge";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TalentPoolPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    const res = await fetch("/api/candidates");
    const data = await res.json();
    setCandidates(data.data || []);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) return fetchCandidates();
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=candidates`);
    const data = await res.json();
    setCandidates(data.results || []);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.firstName} {item.lastName}</p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      ),
    },
    { key: "currentTitle", header: "Title", render: (item: any) => item.currentTitle || "—" },
    { key: "currentCompany", header: "Company", render: (item: any) => item.currentCompany || "—" },
    { key: "locationState", header: "Location", render: (item: any) => item.locationCity ? `${item.locationCity}, ${item.locationState}` : "—" },
    { key: "yearsExperience", header: "Exp", render: (item: any) => item.yearsExperience ? `${item.yearsExperience}y` : "—" },
    { key: "talentScore", header: "Score", render: (item: any) => <ScoreBadge score={item.talentScore} size="sm" /> },
  ];

  return (
    <div>
      <PageHeader title="Talent Pool" description="Browse and search all candidates">
        <button
          onClick={() => router.push("/recruiter/talent-pool?new=true")}
          className="flex items-center gap-2 rounded-lg bg-[#455E7F] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a5170] transition"
        >
          <Plus className="h-4 w-4" /> Add Candidate
        </button>
      </PageHeader>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name, title, company..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#455E7F] focus:outline-none focus:ring-1 focus:ring-[#455E7F]"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <DataTable
          data={candidates}
          columns={columns}
          onRowClick={(item) => router.push(`/recruiter/talent-pool?id=${item.id}`)}
          emptyMessage="No candidates found. Try a different search or add a candidate."
        />
      )}
    </div>
  );
}
