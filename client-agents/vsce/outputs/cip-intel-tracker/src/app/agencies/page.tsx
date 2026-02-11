"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Rss,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { getAgencies, getNewsItems, getProjects, addNewsSource } from "@/lib/store";
import {
  Territory,
  TERRITORY_LABELS,
  Agency,
  NewsSource,
  NEWS_SOURCE_TYPE_LABELS,
} from "@/lib/types";

type TerritoryFilter = Territory | "all";

interface FormData {
  name: string;
  type: string;
  url: string;
  scrapeFrequency: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryFilter>("all");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showAddSourceForm, setShowAddSourceForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "rss",
    url: "",
    scrapeFrequency: "daily",
  });
  const [scrapingStatus, setScrapingStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    try {
      const agenciesData = getAgencies();
      const newsItemsData = getNewsItems();
      const projectsData = getProjects();
      setAgencies(agenciesData);
      setNewsItems(newsItemsData.items);
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter agencies by territory
  const filteredAgencies =
    selectedTerritory === "all"
      ? agencies
      : agencies.filter((a) => a.territory === selectedTerritory);

  // Get news sources for selected agency
  const agencyNewsSources = selectedAgency
    ? selectedAgency.newsSources || []
    : [];

  // Get recent news items for selected agency
  const agencyNewsItems = selectedAgency
    ? newsItems.filter((item) => item.agencyId === selectedAgency.id).slice(0, 5)
    : [];

  // Get projects for selected agency
  const agencyProjects = selectedAgency
    ? projects.filter((p) => p.agencyId === selectedAgency.id).slice(0, 5)
    : [];

  const handleSelectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowDetailPanel(true);
    setShowAddSourceForm(false);
  };

  const handleAddNewsSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency) return;

    try {
      addNewsSource(selectedAgency.id, {
        name: formData.name,
        type: formData.type as any,
        url: formData.url,
        scrapeFrequency: formData.scrapeFrequency as any,
        isActive: true,
      });

      // Reset form and reload agencies
      setFormData({
        name: "",
        type: "rss",
        url: "",
        scrapeFrequency: "daily",
      });
      setShowAddSourceForm(false);

      const updatedAgencies = getAgencies();
      setAgencies(updatedAgencies);

      // Update selected agency
      const updated = updatedAgencies.find((a) => a.id === selectedAgency.id);
      if (updated) setSelectedAgency(updated);
    } catch (error) {
      console.error("Failed to add news source:", error);
      alert("Failed to add news source");
    }
  };

  const handleTestScrape = async (sourceId: string) => {
    setScrapingStatus((prev) => ({ ...prev, [sourceId]: true }));
    try {
      // Simulate scrape delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setScrapingStatus((prev) => ({ ...prev, [sourceId]: false }));
    } catch (error) {
      console.error("Scrape failed:", error);
      setScrapingStatus((prev) => ({ ...prev, [sourceId]: false }));
    }
  };

  const getTerritoryColor = (territory: Territory): string => {
    const colors: Record<Territory, string> = {
      socal: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      norcal: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      pnw: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    };
    return colors[territory];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#9898ac] animate-spin mx-auto mb-4" />
          <p className="text-[#9898ac]">Loading agencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${showDetailPanel ? "mr-96" : ""}`}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#111119]/80 backdrop-blur border-b border-[#2a2a3a] px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#e8e8f0]">Agencies</h1>
                <p className="text-[#9898ac] mt-1">
                  {filteredAgencies.length} agency{filteredAgencies.length !== 1 ? "ies" : ""} found
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#13131d] border border-[#2a2a3a] rounded-lg">
                <Building2 className="h-5 w-5 text-[#9898ac]" />
                <span className="text-lg font-semibold text-[#e8e8f0]">
                  {agencies.length}
                </span>
              </div>
            </div>

            {/* Territory Filter Tabs */}
            <div className="flex gap-3 flex-wrap">
              {["all", "socal", "norcal", "pnw"].map((territory) => (
                <button
                  key={territory}
                  onClick={() => setSelectedTerritory(territory as TerritoryFilter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTerritory === territory
                      ? "bg-blue-600 text-white"
                      : "bg-[#13131d] text-[#9898ac] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                  }`}
                >
                  {territory === "all"
                    ? "All Territories"
                    : TERRITORY_LABELS[territory as Territory]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agency Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredAgencies.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-[#6b6b80] mx-auto mb-4" />
              <p className="text-[#9898ac]">No agencies found in this territory</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgencies.map((agency) => {
                const newsSourceCount = agency.newsSources?.length || 0;
                const isActive = agency.isActive;
                const projects_count = projects.filter(
                  (p) => p.agencyId === agency.id
                ).length;

                return (
                  <button
                    key={agency.id}
                    onClick={() => handleSelectAgency(agency)}
                    className="relative group text-left transition-all duration-200 hover:scale-105 focus:outline-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200 blur" />
                    <div className="relative bg-[#13131d] border border-[#2a2a3a] group-hover:border-[#3a3a4a] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#e8e8f0] truncate">
                            {agency.shortName}
                          </h3>
                          <p className="text-sm text-[#9898ac] truncate mt-1">
                            {agency.name}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTerritoryColor(
                            agency.territory
                          )}`}
                        >
                          {TERRITORY_LABELS[agency.territory]}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-4 flex-1">
                        {/* Capital Program */}
                        {agency.capitalProgram && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#9898ac]">
                              Capital Program
                            </span>
                            <span className="text-sm font-semibold text-[#e8e8f0]">
                              {agency.capitalProgram}
                            </span>
                          </div>
                        )}

                        {/* DBE Goal */}
                        {agency.dbeGoal && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#9898ac]">DBE Goal</span>
                            <span className="text-sm font-semibold text-[#e8e8f0]">
                              {agency.dbeGoal}%
                            </span>
                          </div>
                        )}

                        {/* News Sources */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#9898ac]">News Sources</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#e8e8f0]">
                              {newsSourceCount}
                            </span>
                            {newsSourceCount > 0 ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#9898ac]" />
                            )}
                          </div>
                        </div>

                        {/* Projects */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#9898ac]">Projects</span>
                          <span className="text-sm font-semibold text-[#e8e8f0]">
                            {projects_count}
                          </span>
                        </div>
                      </div>

                      {/* Key Projects */}
                      {projects_count > 0 && (
                        <div className="mb-4 pb-4 border-t border-[#2a2a3a]">
                          <p className="text-xs text-[#6b6b80] font-medium mb-2">
                            Key Projects
                          </p>
                          <div className="space-y-1">
                            {projects
                              .filter((p) => p.agencyId === agency.id)
                              .slice(0, 2)
                              .map((project) => (
                                <p
                                  key={project.id}
                                  className="text-xs text-[#9898ac] truncate"
                                >
                                  • {project.name}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3a]">
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs font-medium text-[#9898ac]">
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="text-[#6b6b80] group-hover:text-[#9898ac] transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel - Slide Out */}
      {showDetailPanel && selectedAgency && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-[#111119] border-l border-[#2a2a3a] shadow-2xl flex flex-col z-50">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2a2a3a] sticky top-0 bg-[#111119]/95 backdrop-blur z-10">
            <h2 className="text-xl font-bold text-[#e8e8f0]">
              {selectedAgency.shortName}
            </h2>
            <button
              onClick={() => setShowDetailPanel(false)}
              className="p-1 hover:bg-[#1a1a25] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-[#9898ac]" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Agency Info */}
            <div className="p-6 border-b border-[#2a2a3a]">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#6b6b80] uppercase">
                    Full Name
                  </p>
                  <p className="text-sm text-[#e8e8f0] mt-1">{selectedAgency.name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#6b6b80] uppercase">
                    Territory
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTerritoryColor(
                        selectedAgency.territory
                      )}`}
                    >
                      {TERRITORY_LABELS[selectedAgency.territory]}
                    </span>
                  </div>
                </div>

                {selectedAgency.contactPhone && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#6b6b80] uppercase">
                      <Phone className="h-3 w-3" />
                      Phone
                    </div>
                    <p className="text-sm text-[#e8e8f0] mt-1">
                      {selectedAgency.contactPhone}
                    </p>
                  </div>
                )}

                {selectedAgency.contactEmail && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#6b6b80] uppercase">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                    <p className="text-sm text-[#e8e8f0] mt-1">
                      {selectedAgency.contactEmail}
                    </p>
                  </div>
                )}

                {selectedAgency.website && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#6b6b80] uppercase">
                      <Globe className="h-3 w-3" />
                      Website
                    </div>
                    <a
                      href={selectedAgency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 mt-1 flex items-center gap-1"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {selectedAgency.capitalProgram && (
                  <div>
                    <p className="text-xs font-medium text-[#6b6b80] uppercase">
                      Capital Program
                    </p>
                    <p className="text-sm text-[#e8e8f0] mt-1 font-semibold">
                      {selectedAgency.capitalProgram}
                    </p>
                  </div>
                )}

                {selectedAgency.dbeGoal && (
                  <div>
                    <p className="text-xs font-medium text-[#6b6b80] uppercase">
                      DBE Goal
                    </p>
                    <p className="text-sm text-[#e8e8f0] mt-1">{selectedAgency.dbeGoal}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* News Sources Section */}
            <div className="p-6 border-b border-[#2a2a3a]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#e8e8f0] flex items-center gap-2">
                  <Rss className="h-4 w-4 text-[#9898ac]" />
                  News Sources ({agencyNewsSources.length})
                </h3>
                {!showAddSourceForm && (
                  <button
                    onClick={() => setShowAddSourceForm(true)}
                    className="p-1 hover:bg-[#1a1a25] rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 text-blue-400" />
                  </button>
                )}
              </div>

              {agencyNewsSources.length === 0 && !showAddSourceForm && (
                <p className="text-xs text-[#6b6b80]">No news sources configured</p>
              )}

              {/* News Sources List */}
              <div className="space-y-3 mb-4">
                {agencyNewsSources.map((source: NewsSource) => (
                  <div
                    key={source.id}
                    className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-[#e8e8f0]">
                          {source.name}
                        </p>
                        <p className="text-xs text-[#6b6b80] mt-1">
                          {NEWS_SOURCE_TYPE_LABELS[source.type]}
                        </p>
                      </div>
                      {source.isActive ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2 truncate"
                    >
                      {source.url}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>

                    {source.lastScrapedAt && (
                      <p className="text-xs text-[#6b6b80] mb-2">
                        Last scraped:{" "}
                        {new Date(source.lastScrapedAt).toLocaleDateString()}
                      </p>
                    )}

                    <button
                      onClick={() => handleTestScrape(source.id)}
                      disabled={scrapingStatus[source.id]}
                      className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] hover:border-[#3a3a4a] rounded text-xs font-medium text-[#9898ac] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {scrapingStatus[source.id] ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3" />
                          Test Scrape
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Source Form */}
              {showAddSourceForm && (
                <form
                  onSubmit={handleAddNewsSource}
                  className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg p-4 space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#9898ac] mb-1">
                      Source Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Agency Newsletter"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#13131d] border border-[#2a2a3a] rounded text-xs text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9898ac] mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#13131d] border border-[#2a2a3a] rounded text-xs text-[#e8e8f0] focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="rss">RSS Feed</option>
                      <option value="email">Email</option>
                      <option value="scraper">Web Scraper</option>
                      <option value="api">API</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9898ac] mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#13131d] border border-[#2a2a3a] rounded text-xs text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9898ac] mb-1">
                      Scrape Frequency
                    </label>
                    <select
                      value={formData.scrapeFrequency}
                      onChange={(e) =>
                        setFormData({ ...formData, scrapeFrequency: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#13131d] border border-[#2a2a3a] rounded text-xs text-[#e8e8f0] focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium text-white transition-colors"
                    >
                      Add Source
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSourceForm(false)}
                      className="flex-1 px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded text-xs font-medium text-[#9898ac] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Recent News Items */}
            {agencyNewsItems.length > 0 && (
              <div className="p-6 border-b border-[#2a2a3a]">
                <h3 className="text-sm font-bold text-[#e8e8f0] flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-[#9898ac]" />
                  Recent News
                </h3>
                <div className="space-y-3">
                  {agencyNewsItems.map((item) => (
                    <div key={item.id} className="bg-[#0a0a0f] rounded p-3">
                      <p className="text-sm font-medium text-[#e8e8f0] line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#6b6b80] mt-2">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {agencyProjects.length > 0 && (
              <div className="p-6">
                <h3 className="text-sm font-bold text-[#e8e8f0] flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-[#9898ac]" />
                  Projects
                </h3>
                <div className="space-y-3">
                  {agencyProjects.map((project) => (
                    <div key={project.id} className="bg-[#0a0a0f] rounded p-3">
                      <p className="text-sm font-medium text-[#e8e8f0]">
                        {project.name}
                      </p>
                      {project.estimatedValue && (
                        <p className="text-xs text-[#9898ac] mt-1">
                          Value: {project.estimatedValue}
                        </p>
                      )}
                      {project.pipelineStage && (
                        <p className="text-xs text-[#6b6b80] mt-1">
                          Stage: {project.pipelineStage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Panel Overlay */}
      {showDetailPanel && (
        <div
          onClick={() => setShowDetailPanel(false)}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}
    </div>
  );
}
