"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ExternalLink,
  Tag,
  X,
  Newspaper,
  Globe,
  FileText,
  Rss,
  Building2,
  Clock,
  Sparkles,
  Archive,
  ChevronDown,
} from "lucide-react";
import {
  getNewsItems,
  getAgencies,
  getProjects,
  updateNewsItem,
  tagNewsToProject,
  getAgency,
} from "@/lib/store";
import { Territory, TERRITORY_LABELS, NewsItem } from "@/lib/types";
import { formatDateRelative, cn, truncate, getRelevanceBg } from "@/lib/utils";

type FilterTerritory = "all" | Territory;
type FilterStatus = "all" | "unprocessed" | "processed" | "archived";

export default function NewsPage() {
  const [selectedTerritory, setSelectedTerritory] = useState<FilterTerritory>("all");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState<string | null>(null);

  const agencies = useMemo(() => getAgencies(), []);
  const { items: allNews } = useMemo(() => getNewsItems(), []);
  const projects = useMemo(() => getProjects(), []);

  // Apply filters
  const filteredNews = useMemo(() => {
    let filtered = allNews;

    // Territory filter
    if (selectedTerritory !== "all") {
      filtered = filtered.filter((n) => n.territory === selectedTerritory);
    }

    // Agency filter
    if (selectedAgency !== "all") {
      filtered = filtered.filter((n) => n.agencyId === selectedAgency);
    }

    // Status filter
    if (selectedStatus !== "all") {
      if (selectedStatus === "unprocessed") {
        filtered = filtered.filter((n) => !n.isProcessed && !n.isArchived);
      } else if (selectedStatus === "processed") {
        filtered = filtered.filter((n) => n.isProcessed && !n.isArchived);
      } else if (selectedStatus === "archived") {
        filtered = filtered.filter((n) => n.isArchived);
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.excerpt?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allNews, selectedTerritory, selectedAgency, selectedStatus, searchQuery]);

  const selectedNews = selectedNewsId ? allNews.find((n) => n.id === selectedNewsId) : null;

  // Get territory badge color
  const getTerritoryColor = (territory: Territory) => {
    switch (territory) {
      case "socal":
        return "bg-amber-500/20 text-amber-200 border-amber-500/30";
      case "norcal":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      case "pnw":
        return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
      default:
        return "bg-slate-500/20 text-slate-200 border-slate-500/30";
    }
  };

  // Get source type icon
  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "rss_feed":
        return <Rss className="w-4 h-4" />;
      case "cip_page":
      case "project_page":
        return <FileText className="w-4 h-4" />;
      case "press_release":
        return <Newspaper className="w-4 h-4" />;
      case "planet_bids":
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const handleTagToProject = (newsId: string, projectId: string) => {
    tagNewsToProject(newsId, projectId);
    setShowProjectDropdown(null);
    // Force re-render by updating the selected news
    if (selectedNews) {
      const updated = allNews.find((n) => n.id === newsId);
      if (updated) {
        // This triggers a re-fetch on next render
        setSelectedNewsId(updated.id);
      }
    }
  };

  const handleArchive = (newsId: string) => {
    updateNewsItem(newsId, { isArchived: true });
    setSelectedNewsId(null);
  };

  const handleProcess = (newsId: string) => {
    updateNewsItem(newsId, { isProcessed: true });
    if (selectedNews) {
      setSelectedNewsId(newsId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-[#2a2a3a] bg-[#111119] sticky top-0 z-30">
        <div className="max-w-full px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="w-7 h-7 text-blue-400" />
            <h1 className="text-3xl font-bold text-[#e8e8f0]">News Feed</h1>
          </div>

          {/* Filters Row */}
          <div className="space-y-4">
            {/* Territory Filter Pills */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#9898ac]">Territory:</span>
              <div className="flex gap-2">
                {["all", "socal", "norcal", "pnw"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTerritory(t as FilterTerritory)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      selectedTerritory === t
                        ? "bg-blue-600/80 text-white border-blue-500"
                        : "bg-[#1a1a25] text-[#9898ac] border-[#2a2a3a] hover:border-[#3a3a4a]"
                    )}
                  >
                    {t === "all" ? "All" : TERRITORY_LABELS[t as Territory].split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#9898ac]">Status:</span>
              <div className="flex gap-2">
                {["all", "unprocessed", "processed", "archived"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s as FilterStatus)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      selectedStatus === s
                        ? "bg-blue-600/80 text-white border-blue-500"
                        : "bg-[#1a1a25] text-[#9898ac] border-[#2a2a3a] hover:border-[#3a3a4a]"
                    )}
                  >
                    {s === "all"
                      ? "All"
                      : s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Agency Dropdown & Search */}
            <div className="flex gap-3">
              {/* Agency Dropdown */}
              <div className="relative">
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className={cn(
                    "appearance-none px-4 py-2 rounded-lg text-sm font-medium",
                    "bg-[#1a1a25] text-[#e8e8f0] border border-[#2a2a3a]",
                    "hover:border-[#3a3a4a] focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    "transition-all cursor-pointer"
                  )}
                >
                  <option value="all">All Agencies</option>
                  {agencies.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.shortName || a.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80] pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                <input
                  type="text"
                  placeholder="Search by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg text-sm",
                    "bg-[#1a1a25] text-[#e8e8f0] border border-[#2a2a3a]",
                    "placeholder-[#6b6b80] focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    "transition-all"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-8 py-6">
        <div className="grid grid-cols-1 gap-6">
          {/* News List or Empty State */}
          {filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Newspaper className="w-12 h-12 text-[#6b6b80] mb-3" />
              <p className="text-[#9898ac] text-lg">No news items match your filters</p>
              <p className="text-[#6b6b80] text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results count */}
              <div className="text-sm text-[#9898ac]">
                Showing {filteredNews.length} of {allNews.length} items
              </div>

              {/* News Cards */}
              {filteredNews.map((newsItem) => {
                const agency = getAgency(newsItem.agencyId);
                const linkedProject = newsItem.projectId
                  ? projects.find((p) => p.id === newsItem.projectId)
                  : null;

                return (
                  <button
                    key={newsItem.id}
                    onClick={() => setSelectedNewsId(newsItem.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-lg border transition-all",
                      "bg-[#13131d] border-[#2a2a3a] hover:border-[#3a3a4a]",
                      "hover:bg-[#1a1a25] cursor-pointer group"
                    )}
                  >
                    <div className="space-y-3">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Agency Badge */}
                          {agency && (
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-semibold border",
                                getTerritoryColor(agency.territory)
                              )}
                            >
                              {agency.shortName || agency.name}
                            </span>
                          )}

                          {/* Time Ago */}
                          <span className="flex items-center gap-1 text-xs text-[#6b6b80]">
                            <Clock className="w-3 h-3" />
                            {formatDateRelative(newsItem.scrapedAt)}
                          </span>

                          {/* Relevance Score */}
                          {newsItem.relevanceScore && (
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-semibold border",
                                getRelevanceBg(newsItem.relevanceScore)
                              )}
                            >
                              {newsItem.relevanceScore}%
                            </span>
                          )}

                          {/* Processed Badge */}
                          {newsItem.isProcessed && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                              <Sparkles className="w-3 h-3" />
                              Processed
                            </span>
                          )}
                        </div>

                        {/* Source Icon */}
                        <div className="text-[#6b6b80] group-hover:text-[#9898ac]">
                          {getSourceIcon(newsItem.sourceId)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[#e8e8f0] group-hover:text-blue-300 transition-colors">
                        {newsItem.title}
                      </h3>

                      {/* Excerpt or Content Preview */}
                      <p className="text-sm text-[#9898ac] leading-relaxed">
                        {newsItem.excerpt
                          ? newsItem.excerpt
                          : truncate(newsItem.content, 150)}
                      </p>

                      {/* Tags */}
                      {newsItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {newsItem.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-md text-xs bg-[#1a1a25] text-[#9898ac] border border-[#2a2a3a]"
                            >
                              #{tag}
                            </span>
                          ))}
                          {newsItem.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-md text-xs text-[#6b6b80]">
                              +{newsItem.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Project Tag & Action Row */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {linkedProject && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium">
                              <Building2 className="w-3 h-3" />
                              {linkedProject.name}
                            </span>
                          )}
                        </div>

                        {!linkedProject && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowProjectDropdown(
                                  showProjectDropdown === newsItem.id ? null : newsItem.id
                                );
                              }}
                              className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                "bg-blue-500/20 text-blue-200 border border-blue-500/30",
                                "hover:bg-blue-500/30 transition-all"
                              )}
                            >
                              <Tag className="w-3 h-3" />
                              Tag to Project
                            </button>

                            {/* Project Dropdown */}
                            {showProjectDropdown === newsItem.id && (
                              <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg shadow-lg z-40 min-w-[200px] max-h-[300px] overflow-y-auto">
                                {projects.length === 0 ? (
                                  <div className="px-3 py-2 text-xs text-[#6b6b80]">
                                    No projects available
                                  </div>
                                ) : (
                                  projects.map((project) => (
                                    <button
                                      key={project.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTagToProject(newsItem.id, project.id);
                                      }}
                                      className={cn(
                                        "w-full text-left px-3 py-2 text-xs text-[#e8e8f0]",
                                        "hover:bg-[#252530] transition-colors border-b border-[#2a2a3a] last:border-0"
                                      )}
                                    >
                                      <div className="font-medium">{project.name}</div>
                                      <div className="text-[#6b6b80] text-xs mt-0.5">
                                        {TERRITORY_LABELS[project.territory].split(" ")[0]}
                                      </div>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className={cn(
                "bg-[#111119] rounded-xl border border-[#2a2a3a] max-w-2xl w-full",
                "max-h-[90vh] overflow-y-auto shadow-2xl"
              )}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#111119] border-b border-[#2a2a3a] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#e8e8f0] flex-1 pr-4">
                  News Details
                </h2>
                <button
                  onClick={() => setSelectedNewsId(null)}
                  className="p-1.5 hover:bg-[#1a1a25] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#9898ac]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Title & Agency */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold text-[#e8e8f0]">
                      {selectedNews.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const agency = getAgency(selectedNews.agencyId);
                      if (!agency) return null;
                      return (
                        <span
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-semibold border",
                            getTerritoryColor(agency.territory)
                          )}
                        >
                          {agency.name}
                        </span>
                      );
                    })()}

                    {selectedNews.relevanceScore && (
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-semibold border",
                          getRelevanceBg(selectedNews.relevanceScore)
                        )}
                      >
                        Relevance: {selectedNews.relevanceScore}%
                      </span>
                    )}

                    {selectedNews.isProcessed && (
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                        <Sparkles className="w-4 h-4" />
                        AI Processed
                      </span>
                    )}

                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-[#9898ac] bg-[#1a1a25] border border-[#2a2a3a]">
                      <Clock className="w-4 h-4" />
                      {formatDateRelative(selectedNews.scrapedAt)}
                    </span>
                  </div>
                </div>

                {/* AI Excerpt */}
                {selectedNews.excerpt && (
                  <div className="bg-[#13131d] border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">
                        AI Summary
                      </span>
                    </div>
                    <p className="text-[#e8e8f0] leading-relaxed">
                      {selectedNews.excerpt}
                    </p>
                  </div>
                )}

                {/* Original Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#e8e8f0]">
                    Original Content
                  </h3>
                  <div className="bg-[#13131d] border border-[#2a2a3a] rounded-lg p-4">
                    <p className="text-[#e8e8f0] leading-relaxed whitespace-pre-wrap">
                      {selectedNews.content}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {selectedNews.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#e8e8f0]">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNews.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1a25] text-[#9898ac] border border-[#2a2a3a]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Project */}
                {(() => {
                  const linkedProject = selectedNews.projectId
                    ? projects.find((p) => p.id === selectedNews.projectId)
                    : null;
                  if (!linkedProject) return null;
                  return (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">
                          Linked Project
                        </span>
                      </div>
                      <p className="text-[#e8e8f0] font-medium">{linkedProject.name}</p>
                      <p className="text-[#9898ac] text-sm mt-1">
                        {linkedProject.description}
                      </p>
                    </div>
                  );
                })()}

                {/* Source Link */}
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg",
                    "bg-blue-500/20 text-blue-200 border border-blue-500/30",
                    "hover:bg-blue-500/30 transition-all"
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Source
                </a>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#2a2a3a]">
                  {!selectedNews.isProcessed && (
                    <button
                      onClick={() => handleProcess(selectedNews.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                        "bg-purple-600/80 text-white border border-purple-500",
                        "hover:bg-purple-700 transition-all font-medium"
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      Process with AI
                    </button>
                  )}

                  {!selectedNews.isArchived && (
                    <button
                      onClick={() => handleArchive(selectedNews.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                        "bg-slate-600/60 text-[#e8e8f0] border border-[#3a3a4a]",
                        "hover:bg-slate-600/80 transition-all font-medium"
                      )}
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
