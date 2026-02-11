"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("location", e.target.value);
    } else {
      params.delete("location");
    }
    router.push(`?${params.toString()}`);
  };

  const handleEmploymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("employment", e.target.value);
    } else {
      params.delete("employment");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
        <select
          name="location"
          defaultValue={searchParams.get("location") || ""}
          onChange={handleLocationChange}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-[#455E7F] focus:ring-1 focus:ring-[#455E7F]"
        >
          <option value="">All Locations</option>
          <option value="onsite">On-Site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
        <select
          name="employment"
          defaultValue={searchParams.get("employment") || ""}
          onChange={handleEmploymentChange}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-[#455E7F] focus:ring-1 focus:ring-[#455E7F]"
        >
          <option value="">All Types</option>
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="temp">Temporary</option>
          <option value="intern">Internship</option>
        </select>
      </div>
    </div>
  );
}
