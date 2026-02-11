"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  RefreshCw,
  Database,
  Globe,
  Info,
  Zap,
  ToggleLeft,
  ToggleRight,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import {
  getAgencies,
  getNewsSources,
  getNewsItems,
  getProjects,
  initStore,
} from "@/lib/store";
import { TERRITORY_LABELS } from "@/lib/types";
import type { Territory } from "@/lib/types";

export default function SettingsPage() {
  const [stats, setStats] = useState({
    totalAgencies: 0,
    totalSources: 0,
    totalNewsItems: 0,
    totalProjects: 0,
  });

  const [scrapeConfig, setScrapeConfig] = useState({
    frequency: "daily" as "hourly" | "daily" | "weekly",
    autoScrapeEnabled: true,
    lastScrapeTime: null as string | null,
    scrapeStatus: "idle" as "idle" | "scraping" | "success" | "error",
    scrapeMessage: "",
  });

  const [territories, setTerritories] = useState<
    Array<{
      key: Territory;
      label: string;
      enabled: boolean;
      agencyCount: number;
    }>
  >([
    { key: "socal", label: TERRITORY_LABELS["socal"], enabled: true, agencyCount: 0 },
    {
      key: "norcal",
      label: TERRITORY_LABELS["norcal"],
      enabled: true,
      agencyCount: 0,
    },
    { key: "pnw", label: TERRITORY_LABELS["pnw"], enabled: true, agencyCount: 0 },
  ]);

  const [scraping, setScraping] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    try {
      initStore();

      const agencies = getAgencies();
      const newsSources = getNewsSources();
      const newsItemsResult = getNewsItems();
      const projects = getProjects();

      setStats({
        totalAgencies: agencies.length,
        totalSources: newsSources.length,
        totalNewsItems: newsItemsResult.total,
        totalProjects: projects.length,
      });

      // Calculate agency counts per territory
      setTerritories((prev) =>
        prev.map((territory) => ({
          ...territory,
          agencyCount: agencies.filter((a) => a.territory === territory.key)
            .length,
        }))
      );

      // Set last scrape time (simulated)
      const now = new Date();
      const lastScrape = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      setScrapeConfig((prev) => ({
        ...prev,
        lastScrapeTime: lastScrape.toISOString(),
      }));
    } catch (error) {
      console.error("Failed to load settings data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScrapeFrequencyChange = (
    newFrequency: "hourly" | "daily" | "weekly"
  ) => {
    setScrapeConfig((prev) => ({
      ...prev,
      frequency: newFrequency,
    }));
  };

  const handleToggleAutoScrape = () => {
    setScrapeConfig((prev) => ({
      ...prev,
      autoScrapeEnabled: !prev.autoScrapeEnabled,
    }));
  };

  const handleScrapeAllSources = async () => {
    setScraping(true);
    setScrapeConfig((prev) => ({
      ...prev,
      scrapeStatus: "scraping",
      scrapeMessage: "Scraping all active sources...",
    }));

    try {
      // Get all active sources
      const allSources = getNewsSources();
      const activeSources = allSources.filter((s) => s.isActive);

      // Simulate API call to batch scrape
      const response = await fetch("/api/scrape/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceIds: activeSources.map((s) => s.id),
        }),
      });

      if (response.ok) {
        setScrapeConfig((prev) => ({
          ...prev,
          scrapeStatus: "success",
          scrapeMessage: `Successfully scraped ${activeSources.length} sources`,
          lastScrapeTime: new Date().toISOString(),
        }));

        // Reset status after 3 seconds
        setTimeout(() => {
          setScrapeConfig((prev) => ({
            ...prev,
            scrapeStatus: "idle",
            scrapeMessage: "",
          }));
        }, 3000);
      } else {
        setScrapeConfig((prev) => ({
          ...prev,
          scrapeStatus: "error",
          scrapeMessage: "Failed to scrape sources. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Scrape error:", error);
      setScrapeConfig((prev) => ({
        ...prev,
        scrapeStatus: "error",
        scrapeMessage:
          "Error during scraping. Check console for details.",
      }));
    } finally {
      setScraping(false);
    }
  };

  const handleToggleTerritory = (territoryKey: Territory) => {
    setTerritories((prev) =>
      prev.map((t) =>
        t.key === territoryKey ? { ...t, enabled: !t.enabled } : t
      )
    );
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      try {
        initStore();
        // Reload the page to refresh all data
        window.location.reload();
      } catch (error) {
        console.error("Failed to reset data:", error);
        alert("Failed to reset data");
      }
    }
  };

  const handleExportData = () => {
    setExporting(true);
    try {
      const agencies = getAgencies();
      const sources = getNewsSources();
      const newsItems = getNewsItems();
      const projects = getProjects();

      const exportData = {
        exportedAt: new Date().toISOString(),
        stats: {
          agencies: agencies.length,
          sources: sources.length,
          newsItems: newsItems.total,
          projects: projects.length,
        },
        data: {
          agencies,
          sources,
          newsItems: newsItems.items,
          projects,
        },
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cip-intel-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const getLastScrapeDisplay = (): string => {
    if (!scrapeConfig.lastScrapeTime) return "Never";

    const lastScrape = new Date(scrapeConfig.lastScrapeTime);
    const now = new Date();
    const diffMs = now.getTime() - lastScrape.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

    return lastScrape.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#9898ac] animate-spin mx-auto mb-4" />
          <p className="text-[#9898ac]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#111119]/80 backdrop-blur border-b border-[#2a2a3a] px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-[#e8e8f0]">Settings</h1>
              <p className="text-[#9898ac] mt-1">
                Configure scraping, territories, and data management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Scraping Configuration Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-[#e8e8f0]">
              Scraping Configuration
            </h2>
          </div>

          {/* Auto-Scrape Toggle */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#e8e8f0]">
                  Auto-Scraping
                </h3>
                <p className="text-sm text-[#9898ac] mt-1">
                  Automatically scrape all active news sources at the specified
                  frequency
                </p>
              </div>
              <button
                onClick={handleToggleAutoScrape}
                className={`relative inline-flex h-10 w-18 items-center rounded-full transition-colors ${
                  scrapeConfig.autoScrapeEnabled
                    ? "bg-blue-600"
                    : "bg-[#2a2a3a]"
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    scrapeConfig.autoScrapeEnabled
                      ? "translate-x-9"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Frequency Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#e8e8f0] mb-3">
                Scrape Frequency
              </label>
              <div className="flex gap-3 flex-wrap">
                {(["hourly", "daily", "weekly"] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleScrapeFrequencyChange(freq)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      scrapeConfig.frequency === freq
                        ? "bg-blue-600 text-white"
                        : "bg-[#13131d] text-[#9898ac] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrape Status and Last Scrape */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-[#9898ac]" />
                <h3 className="font-semibold text-[#e8e8f0]">
                  Last Scrape Time
                </h3>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {getLastScrapeDisplay()}
              </p>
              {scrapeConfig.lastScrapeTime && (
                <p className="text-xs text-[#6b6b80] mt-2">
                  {new Date(scrapeConfig.lastScrapeTime).toLocaleString()}
                </p>
              )}
            </div>

            <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                {scrapeConfig.scrapeStatus === "idle" && (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
                {scrapeConfig.scrapeStatus === "scraping" && (
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                )}
                {scrapeConfig.scrapeStatus === "error" && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {scrapeConfig.scrapeStatus === "success" && (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
                <h3 className="font-semibold text-[#e8e8f0]">
                  Scrape Status
                </h3>
              </div>
              <p
                className={`text-lg font-bold capitalize ${
                  scrapeConfig.scrapeStatus === "idle"
                    ? "text-emerald-400"
                    : scrapeConfig.scrapeStatus === "scraping"
                      ? "text-blue-400"
                      : scrapeConfig.scrapeStatus === "success"
                        ? "text-emerald-400"
                        : "text-red-400"
                }`}
              >
                {scrapeConfig.scrapeStatus}
              </p>
              {scrapeConfig.scrapeMessage && (
                <p className="text-xs text-[#9898ac] mt-2">
                  {scrapeConfig.scrapeMessage}
                </p>
              )}
            </div>
          </div>

          {/* Scrape All Button */}
          <button
            onClick={handleScrapeAllSources}
            disabled={scraping}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              scraping
                ? "bg-blue-500 text-white opacity-75 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {scraping ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scraping All Sources...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Scrape All Sources Now
              </>
            )}
          </button>
        </section>

        {/* Territory Management Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-[#e8e8f0]">
              Territory Management
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {territories.map((territory) => (
              <div
                key={territory.key}
                className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#e8e8f0]">
                      {territory.label}
                    </h3>
                    <p className="text-sm text-[#9898ac] mt-1">
                      {territory.agencyCount} agencies
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleTerritory(territory.key)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      territory.enabled ? "bg-emerald-600" : "bg-[#2a2a3a]"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        territory.enabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    territory.enabled
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {territory.enabled ? "Enabled" : "Disabled"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Management Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-[#e8e8f0]">
              Data Management
            </h2>
          </div>

          {/* Statistics Card */}
          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6">
            <h3 className="font-semibold text-[#e8e8f0] mb-4">
              Database Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0f] border border-[#2a2a3a] rounded p-4">
                <p className="text-xs font-medium text-[#6b6b80] uppercase mb-2">
                  Total Agencies
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.totalAgencies}
                </p>
              </div>
              <div className="bg-[#0a0a0f] border border-[#2a2a3a] rounded p-4">
                <p className="text-xs font-medium text-[#6b6b80] uppercase mb-2">
                  News Sources
                </p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.totalSources}
                </p>
              </div>
              <div className="bg-[#0a0a0f] border border-[#2a2a3a] rounded p-4">
                <p className="text-xs font-medium text-[#6b6b80] uppercase mb-2">
                  News Items
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.totalNewsItems}
                </p>
              </div>
              <div className="bg-[#0a0a0f] border border-[#2a2a3a] rounded p-4">
                <p className="text-xs font-medium text-[#6b6b80] uppercase mb-2">
                  Projects
                </p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </div>

          {/* Export Data Button */}
          <button
            onClick={handleExportData}
            disabled={exporting}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              exporting
                ? "bg-emerald-500 text-white opacity-75 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {exporting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Export Data as JSON
              </>
            )}
          </button>

          {/* Reset Data Button */}
          <button
            onClick={handleResetData}
            className="w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30"
          >
            <AlertCircle className="h-5 w-5" />
            Reset Demo Data
          </button>
        </section>

        {/* About Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-[#e8e8f0]">About</h2>
          </div>

          <div className="bg-[#111119] border border-[#2a2a3a] rounded-lg p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#6b6b80] uppercase">
                Application
              </p>
              <p className="text-lg font-semibold text-[#e8e8f0] mt-1">
                CIP Intel Tracker
              </p>
            </div>

            <div className="border-t border-[#2a2a3a] pt-4">
              <p className="text-xs font-medium text-[#6b6b80] uppercase">
                Version
              </p>
              <p className="text-lg font-semibold text-[#e8e8f0] mt-1">
                1.0.0
              </p>
            </div>

            <div className="border-t border-[#2a2a3a] pt-4">
              <p className="text-xs font-medium text-[#6b6b80] uppercase">
                Company
              </p>
              <p className="text-lg font-semibold text-[#e8e8f0] mt-1">
                VSCE, Inc.
              </p>
            </div>

            <div className="border-t border-[#2a2a3a] pt-4">
              <p className="text-xs font-medium text-[#6b6b80] uppercase">
                Description
              </p>
              <p className="text-sm text-[#9898ac] mt-2">
                Capital Improvement Program intelligence system for pre-CRM
                tracking. Monitors public infrastructure projects across
                multiple territories to identify business opportunities and
                inform strategic decision-making.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
