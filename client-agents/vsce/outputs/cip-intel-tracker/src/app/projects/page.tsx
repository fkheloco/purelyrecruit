"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle,
  DollarSign,
  Calendar,
  Building2,
  ChevronDown,
  Plus,
  ArrowRight,
} from "lucide-react";
import { getProjects, getAgencies, updateProject, getAgency } from "@/lib/store";
import {
  CIPProject,
  PipelineStage,
  PIPELINE_STAGES,
  ACTIVE_PIPELINE_STAGES,
  Territory,
  TERRITORY_LABELS,
} from "@/lib/types";
import { formatDate, formatDateRelative, formatCurrency, cn } from "@/lib/utils";

type SortBy = "name" | "value" | "stage" | "updated";
type ViewMode = "table" | "cards";

// Stage color map
const STAGE_COLOR_MAP: Record<PipelineStage, string> = {
  cip_identified: "#6366f1",
  monitoring: "#8b5cf6",
  pre_sell: "#a855f7",
  pre_solicitation: "#d946ef",
  solicitation: "#ec4899",
  wheelhouse_review: "#f97316",
  go_no_go: "#eab308",
  proposal: "#22c55e",
  submitted: "#14b8a6",
  awarded: "#10b981",
  not_awarded: "#ef4444",
  no_go: "#9ca3af",
  dumped: "#6b7280",
};

const TERRITORY_COLORS: Record<Territory, string> = {
  socal: "#ef4444",
  norcal: "#f59e0b",
  pnw: "#3b82f6",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<CIPProject[]>([]);
  const [agencies, setAgencies] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | "all">(
    "all"
  );
  const [selectedStage, setSelectedStage] = useState<PipelineStage | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Load data
  useEffect(() => {
    const allProjects = getProjects();
    setProjects(allProjects);

    const agencyList = getAgencies();
    const agencyMap: Record<string, any> = {};
    agencyList.forEach((a) => {
      agencyMap[a.id] = a;
    });
    setAgencies(agencyMap);

    setLoading(false);
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Territory filter
    if (selectedTerritory !== "all") {
      filtered = filtered.filter((p) => p.territory === selectedTerritory);
    }

    // Stage filter
    if (selectedStage !== "all") {
      filtered = filtered.filter((p) => p.pipelineStage === selectedStage);
    }

    // Search by project name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (agencies[p.agencyId]?.name || "")
            .toLowerCase()
            .includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "value":
          return (b.estimatedValueNum || 0) - (a.estimatedValueNum || 0);
        case "stage": {
          const stageIndexA = ACTIVE_PIPELINE_STAGES.indexOf(a.pipelineStage);
          const stageIndexB = ACTIVE_PIPELINE_STAGES.indexOf(b.pipelineStage);
          return stageIndexA - stageIndexB;
        }
        case "updated":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    return filtered;
  }, [projects, selectedTerritory, selectedStage, searchQuery, sortBy, agencies]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = projects.reduce(
      (sum, p) => sum + (p.estimatedValueNum || 0),
      0
    );
    const stageBreakdown: Record<PipelineStage, number> = {} as any;
    PIPELINE_STAGES.forEach((stage) => {
      stageBreakdown[stage.key] = projects.filter(
        (p) => p.pipelineStage === stage.key
      ).length;
    });

    const now = new Date();
    const upcomingDeadlines = projects.filter((p) => {
      if (!p.rfpDeadline) return false;
      const deadline = new Date(p.rfpDeadline);
      const daysUntil = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil > 0 && daysUntil <= 30;
    }).length;

    return {
      total: projects.length,
      totalValue,
      stageBreakdown,
      upcomingDeadlines,
    };
  }, [projects]);

  const handleStageChange = (projectId: string, newStage: PipelineStage) => {
    updateProject(projectId, { pipelineStage: newStage });
    setProjects(getProjects());
  };

  const getDaysUntilDeadline = (rfpDeadline?: string): number | null => {
    if (!rfpDeadline) return null;
    const deadline = new Date(rfpDeadline);
    const now = new Date();
    return Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getDeadlineColor = (daysUntil: number | null): string => {
    if (daysUntil === null) return "text-[#9898ac]";
    if (daysUntil <= 7) return "text-red-400";
    if (daysUntil <= 14) return "text-orange-400";
    if (daysUntil <= 30) return "text-yellow-400";
    return "text-green-400";
  };

  const getWheelhouseIcon = (inWheelhouse?: boolean) => {
    if (inWheelhouse === true) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (inWheelhouse === false) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <HelpCircle className="w-5 h-5 text-[#6b6b80]" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#e8e8f0]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Header */}
      <div className="border-b border-[#2a2a3a] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold">Projects</h1>
            </div>
            <Link
              href="/pipeline?modal=add"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Link>
          </div>
          <p className="text-[#9898ac]">
            {filteredProjects.length} projects
            {selectedTerritory !== "all" && ` • ${selectedTerritory.toUpperCase()}`}
            {selectedStage !== "all" && ` • ${PIPELINE_STAGES.find(s => s.key === selectedStage)?.label}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Projects */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FolderKanban className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">All stages combined</p>
          </div>

          {/* Total Est. Value */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Total Est. Value</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">Pipeline opportunities</p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Urgent Deadlines</p>
                <p className="text-3xl font-bold text-orange-400">
                  {stats.upcomingDeadlines}
                </p>
              </div>
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">Next 30 days</p>
          </div>

          {/* By Territory */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 hover:border-[#3a3a4a] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9898ac] text-sm mb-1">Territories</p>
                <div className="flex gap-2 mt-1">
                  {(Object.keys(TERRITORY_LABELS) as Territory[]).map((t) => {
                    const count = projects.filter(
                      (p) => p.territory === t
                    ).length;
                    return (
                      <div
                        key={t}
                        className="text-xs font-mono"
                        style={{
                          color: TERRITORY_COLORS[t],
                        }}
                      >
                        {count}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-[#6b6b80]">SoCal / NorCal / PNW</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#9898ac] mb-3">
                Search by Name or Agency
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a25] border border-[#2a2a3a] rounded-lg py-2 pl-10 pr-4 text-[#e8e8f0] placeholder-[#6b6b80] focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Territory Filter */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#9898ac] mb-3">
                Territory
              </label>
              <div className="flex flex-wrap gap-2">
                {["all", "socal", "norcal", "pnw"].map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setSelectedTerritory(t as Territory | "all")
                    }
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                      selectedTerritory === t
                        ? "bg-indigo-600 text-white"
                        : "bg-[#1a1a25] text-[#9898ac] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                    )}
                  >
                    {t === "all"
                      ? "All"
                      : t === "socal"
                        ? "SoCal"
                        : t === "norcal"
                          ? "NorCal"
                          : "PNW"}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Filter */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#9898ac] mb-3">
                Pipeline Stage
              </label>
              <div className="relative">
                <select
                  value={selectedStage}
                  onChange={(e) =>
                    setSelectedStage(e.target.value as PipelineStage | "all")
                  }
                  className="w-full bg-[#1a1a25] border border-[#2a2a3a] rounded-lg py-2 px-3 text-[#e8e8f0] focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="all">All Stages</option>
                  {PIPELINE_STAGES.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b6b80] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-6 pt-6 border-t border-[#2a2a3a]">
            <label className="block text-sm font-medium text-[#9898ac] mb-3">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "name", label: "Name" },
                { key: "value", label: "Est. Value" },
                { key: "stage", label: "Stage" },
                { key: "updated", label: "Recently Updated" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as SortBy)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                    sortBy === option.key
                      ? "bg-indigo-600 text-white"
                      : "bg-[#1a1a25] text-[#9898ac] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                  )}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Table (Desktop) */}
        <div className="hidden lg:block rounded-lg border border-[#2a2a3a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111119] border-b border-[#2a2a3a]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Territory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Est. Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Proc. Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    RFP Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Wheelhouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898ac] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center">
                      <p className="text-[#6b6b80]">No projects match your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const agency = agencies[project.agencyId];
                    const daysUntil = getDaysUntilDeadline(project.rfpDeadline);
                    const stageInfo = PIPELINE_STAGES.find(
                      (s) => s.key === project.pipelineStage
                    );

                    return (
                      <tr
                        key={project.id}
                        className="border-b border-[#2a2a3a] hover:bg-[#13131d] transition-colors"
                      >
                        {/* Project Name */}
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-semibold text-[#e8e8f0] truncate">
                              {project.name}
                            </p>
                            {agency && (
                              <p className="text-xs text-[#6b6b80]">
                                {agency.name}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Agency */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#9898ac]">
                            {agency?.shortName || agency?.name || "—"}
                          </span>
                        </td>

                        {/* Territory */}
                        <td className="px-6 py-4">
                          <span
                            className="inline-block px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${TERRITORY_COLORS[project.territory]}20`,
                              color: TERRITORY_COLORS[project.territory],
                            }}
                          >
                            {project.territory === "socal"
                              ? "SoCal"
                              : project.territory === "norcal"
                                ? "NorCal"
                                : "PNW"}
                          </span>
                        </td>

                        {/* Stage */}
                        <td className="px-6 py-4">
                          <div className="relative inline-block">
                            <select
                              value={project.pipelineStage}
                              onChange={(e) =>
                                handleStageChange(
                                  project.id,
                                  e.target.value as PipelineStage
                                )
                              }
                              className="appearance-none px-3 py-1 rounded text-xs font-medium text-white border-0 cursor-pointer"
                              style={{
                                backgroundColor:
                                  STAGE_COLOR_MAP[project.pipelineStage],
                              }}
                            >
                              {PIPELINE_STAGES.map((stage) => (
                                <option
                                  key={stage.key}
                                  value={stage.key}
                                >
                                  {stage.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
                          </div>
                        </td>

                        {/* Est. Value */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-green-400">
                            {project.estimatedValueNum
                              ? formatCurrency(project.estimatedValueNum)
                              : "—"}
                          </span>
                        </td>

                        {/* Procurement Method */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#9898ac]">
                            {project.procurementMethod
                              ? project.procurementMethod
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())
                              : "—"}
                          </span>
                        </td>

                        {/* RFP Deadline */}
                        <td className="px-6 py-4">
                          {project.rfpDeadline ? (
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  getDeadlineColor(daysUntil)
                                )}
                              >
                                {formatDate(project.rfpDeadline)}
                              </p>
                              {daysUntil !== null && (
                                <p className="text-xs text-[#6b6b80]">
                                  {daysUntil > 0
                                    ? `${daysUntil}d remaining`
                                    : `${Math.abs(daysUntil)}d ago`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-[#6b6b80]">—</span>
                          )}
                        </td>

                        {/* Wheelhouse */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {getWheelhouseIcon(project.inWheelhouse)}
                          </div>
                        </td>

                        {/* Last Updated */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#9898ac]">
                            {formatDateRelative(project.updatedAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <Link
                            href={`/pipeline?projectId=${project.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-medium bg-[#1a1a25] border border-[#2a2a3a] text-[#9898ac] hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                          >
                            View
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Cards (Mobile/Tablet) */}
        <div className="lg:hidden space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6b6b80]">No projects match your filters</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const agency = agencies[project.agencyId];
              const daysUntil = getDaysUntilDeadline(project.rfpDeadline);
              const stageInfo = PIPELINE_STAGES.find(
                (s) => s.key === project.pipelineStage
              );

              return (
                <div
                  key={project.id}
                  className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-4 hover:border-[#3a3a4a] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#e8e8f0] mb-1">
                        {project.name}
                      </h3>
                      {agency && (
                        <p className="text-sm text-[#9898ac]">{agency.name}</p>
                      )}
                    </div>
                    <Link
                      href={`/pipeline?projectId=${project.id}`}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Badge Row */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Territory */}
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${TERRITORY_COLORS[project.territory]}20`,
                        color: TERRITORY_COLORS[project.territory],
                      }}
                    >
                      {project.territory === "socal"
                        ? "SoCal"
                        : project.territory === "norcal"
                          ? "NorCal"
                          : "PNW"}
                    </span>

                    {/* Stage */}
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                      style={{
                        backgroundColor:
                          STAGE_COLOR_MAP[project.pipelineStage],
                      }}
                    >
                      {stageInfo?.label}
                    </span>

                    {/* Wheelhouse */}
                    <span className="inline-flex items-center gap-1">
                      {getWheelhouseIcon(project.inWheelhouse)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-3 text-sm">
                    {project.estimatedValueNum && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#9898ac]">Est. Value:</span>
                        <span className="font-semibold text-green-400">
                          {formatCurrency(project.estimatedValueNum)}
                        </span>
                      </div>
                    )}

                    {project.procurementMethod && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#9898ac]">Proc. Method:</span>
                        <span className="text-[#e8e8f0]">
                          {project.procurementMethod
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    )}

                    {project.rfpDeadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#9898ac]">RFP Deadline:</span>
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              getDeadlineColor(daysUntil)
                            )}
                          >
                            {formatDate(project.rfpDeadline)}
                          </p>
                          {daysUntil !== null && (
                            <p className="text-xs text-[#6b6b80]">
                              {daysUntil > 0
                                ? `${daysUntil}d remaining`
                                : `${Math.abs(daysUntil)}d ago`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[#9898ac]">Updated:</span>
                      <span className="text-[#e8e8f0]">
                        {formatDateRelative(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
