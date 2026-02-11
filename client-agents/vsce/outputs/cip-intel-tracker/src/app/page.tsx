"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Newspaper,
  Building2,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats, getNewsItems, getAgency } from "@/lib/store";
import { PIPELINE_STAGES, ACTIVE_PIPELINE_STAGES } from "@/lib/types";
import type { DashboardStats, NewsItem, CIPProject, Territory } from "@/lib/types";
import { formatDate, formatDateRelative, cn } from "@/lib/utils";

const STAGE_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#a855f7", // purple-alt
  "#d946ef", // pink
  "#ec4899", // pink-alt
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
];

const TERRITORY_COLORS: Record<string, string> = {
  socal: "#ef4444", // red
  norcal: "#f59e0b", // amber
  pnw: "#3b82f6", // blue
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    // Fetch data
    const dashStats = getDashboardStats();
    setStats(dashStats);

    // Get last 5 news items
    const { items } = getNewsItems({
      limit: 5,
      isArchived: false,
    });
    setNewsItems(items);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#e8e8f0]">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#e8e8f0]">No data available</div>
      </div>
    );
  }

  // Calculate stats
  const totalProjects = stats.totalProjects;
  const unprocessedNews = stats.unprocessedNews;
  const activeAgencies = stats.activeAgencies;
  const upcomingDeadlineCount = stats.upcomingDeadlines.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Header */}
      <div className="border-b border-[#2a2a3a] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-[#9898ac]">{dateStr}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Projects */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{totalProjects}</p>
              </div>
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">Active in pipeline</p>
          </div>

          {/* Unprocessed News */}
          <div
            className={cn(
              "bg-[#111119] border rounded-lg p-6 hover:border-[#3a3a4a] transition-colors",
              unprocessedNews > 0
                ? "border-orange-500/30"
                : "border-[#2a2a3a]"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Unprocessed News</p>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    unprocessedNews > 0 ? "text-orange-400" : ""
                  )}
                >
                  {unprocessedNews}
                </p>
              </div>
              {unprocessedNews > 0 && (
                <AlertCircle className="w-5 h-5 text-orange-400" />
              )}
              {unprocessedNews === 0 && (
                <Newspaper className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="text-xs text-[#6b6b80]">
              {unprocessedNews > 0
                ? "Awaiting AI processing"
                : "All processed"}
            </p>
          </div>

          {/* Active Agencies */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Active Agencies</p>
                <p className="text-3xl font-bold">{activeAgencies}</p>
              </div>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">Monitored sources</p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Upcoming Deadlines</p>
                <p className="text-3xl font-bold">{upcomingDeadlineCount}</p>
              </div>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">Next 90 days</p>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">Pipeline Overview</h2>
          </div>

          {/* Pipeline Bar */}
          <div className="space-y-4">
            <div className="flex items-end gap-1 h-32 bg-[#0a0a0f] rounded-lg p-4">
              {ACTIVE_PIPELINE_STAGES.map((stage, idx) => {
                const stageConfig = PIPELINE_STAGES.find((s) => s.key === stage);
                const count = stats.projectsByStage[stage] || 0;
                const maxCount = Math.max(
                  ...ACTIVE_PIPELINE_STAGES.map((s) => stats.projectsByStage[s] || 0)
                );
                const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <div
                    key={stage}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-full rounded-t transition-all hover:opacity-80 cursor-pointer relative group/bar"
                      style={{
                        height: `${Math.max(heightPercent, 5)}%`,
                        backgroundColor: stageConfig?.color || STAGE_COLORS[idx % STAGE_COLORS.length],
                      }}
                    >
                      {count > 0 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9898ac] text-center break-words max-w-[60px] group-hover:text-[#e8e8f0] transition-colors">
                      {stageConfig?.label}
                    </p>
                    {count > 0 && (
                      <span className="text-xs font-semibold text-[#6b6b80]">
                        {count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Territory Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "socal", label: "Southern California" },
            { key: "norcal", label: "Northern California" },
            { key: "pnw", label: "Pacific Northwest" },
          ].map((territory) => (
            <div
              key={territory.key}
              className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: TERRITORY_COLORS[territory.key] }}
                />
                <h3 className="font-semibold text-sm">{territory.label}</h3>
              </div>
              <p className="text-2xl font-bold">
                {stats.projectsByTerritory[territory.key as Territory] || 0}
              </p>
              <p className="text-xs text-[#6b6b80] mt-2">projects</p>
            </div>
          ))}
        </div>

        {/* Recent News */}
        <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">Recent News</h2>
          </div>

          {newsItems.length > 0 ? (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-[#2a2a3a] pb-4 last:border-b-0 last:pb-0 hover:bg-[#13131d] p-3 rounded transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-sm leading-snug flex-1">
                      {item.title}
                    </h3>
                    {item.relevanceScore !== undefined && (
                      <div
                        className={cn(
                          "px-2 py-1 rounded text-xs font-semibold whitespace-nowrap",
                          item.relevanceScore >= 85
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : item.relevanceScore >= 70
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : item.relevanceScore >= 50
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        )}
                      >
                        {item.relevanceScore}%
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#9898ac]">
                    {getAgency(item.agencyId) && (
                      <>
                        <span>{getAgency(item.agencyId)?.shortName}</span>
                        <span className="text-[#6b6b80]">•</span>
                      </>
                    )}
                    <span>{formatDateRelative(item.scrapedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6b6b80] text-sm">No recent news</p>
          )}
        </div>

        {/* Upcoming Deadlines Table */}
        {stats.upcomingDeadlines.length > 0 && (
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold">Upcoming RFP Deadlines</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3a]">
                    <th className="text-left py-3 px-4 font-semibold text-[#9898ac]">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#9898ac]">
                      Agency
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#9898ac]">
                      Deadline
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#9898ac]">
                      Days Left
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#9898ac]">
                      Stage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.upcomingDeadlines.slice(0, 8).map((deadline) => {
                    const stageConfig = PIPELINE_STAGES.find(
                      (s) => s.key === deadline.project.pipelineStage
                    );
                    const agency = getAgency(deadline.project.agencyId);

                    return (
                      <tr
                        key={deadline.project.id}
                        className="border-b border-[#2a2a3a] hover:bg-[#13131d] transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">
                          {deadline.project.name}
                        </td>
                        <td className="py-3 px-4 text-[#9898ac]">
                          {agency?.shortName || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-[#9898ac]">
                          {formatDate(deadline.project.rfpDeadline || "")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "font-semibold",
                              deadline.daysUntil <= 7
                                ? "text-red-400"
                                : deadline.daysUntil <= 30
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            )}
                          >
                            {deadline.daysUntil}d
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${stageConfig?.color}20`,
                              color: stageConfig?.color || "#9898ac",
                              border: `1px solid ${stageConfig?.color}40`,
                            }}
                          >
                            {stageConfig?.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {stats.upcomingDeadlines.length > 8 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs text-[#6b6b80]">
                  Showing 8 of {stats.upcomingDeadlines.length} deadlines
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
