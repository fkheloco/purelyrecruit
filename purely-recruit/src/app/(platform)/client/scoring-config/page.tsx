"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useOrganization } from "@clerk/nextjs";
import { AlertCircle, Save } from "lucide-react";

interface ScoringConfig {
  module1Weight: number;
  module2Weight: number;
  module3Weight: number;
  goodIndicatorBonus: number;
  badIndicatorPenalty: number;
}

export default function ScoringConfigPage() {
  const { organization } = useOrganization();
  const [config, setConfig] = useState<ScoringConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!organization?.id) return;

    fetch(`/api/tenants/${organization.id}/scoring-config`)
      .then(r => r.json())
      .then(data => {
        setConfig(data.data || {
          module1Weight: 35,
          module2Weight: 35,
          module3Weight: 30,
          goodIndicatorBonus: 5,
          badIndicatorPenalty: -10,
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [organization?.id]);

  const handleChange = (field: keyof ScoringConfig, value: number) => {
    setConfig(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!config || !organization?.id) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/tenants/${organization.id}/scoring-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Scoring configuration saved successfully" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to save configuration" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Failed to load scoring configuration</p>
      </div>
    );
  }

  const totalWeight = config.module1Weight + config.module2Weight + config.module3Weight;
  const isValidTotal = totalWeight === 100;

  return (
    <div>
      <PageHeader
        title="Scoring Configuration"
        description="Customize how candidates are scored"
      />

      {message && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-2xl">
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-6 rounded-lg border-l-4 border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Module Weights</p>
                <p className="mt-1">Total must equal 100%. Current total: <span className={`${isValidTotal ? "text-green-600" : "text-red-600"} font-semibold`}>{totalWeight}%</span></p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Module 1 Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Module 1 Weight
              </label>
              <p className="mt-1 text-xs text-gray-500">Resume & Experience Analysis</p>
              <div className="mt-3 flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.module1Weight}
                  onChange={(e) => handleChange("module1Weight", Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.module1Weight}
                  onChange={(e) => handleChange("module1Weight", Number(e.target.value))}
                  className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                />
                <span className="text-sm font-medium text-gray-500 w-8">%</span>
              </div>
            </div>

            {/* Module 2 Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Module 2 Weight
              </label>
              <p className="mt-1 text-xs text-gray-500">Skills & Qualifications</p>
              <div className="mt-3 flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.module2Weight}
                  onChange={(e) => handleChange("module2Weight", Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.module2Weight}
                  onChange={(e) => handleChange("module2Weight", Number(e.target.value))}
                  className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                />
                <span className="text-sm font-medium text-gray-500 w-8">%</span>
              </div>
            </div>

            {/* Module 3 Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Module 3 Weight
              </label>
              <p className="mt-1 text-xs text-gray-500">Cultural Fit & Soft Skills</p>
              <div className="mt-3 flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.module3Weight}
                  onChange={(e) => handleChange("module3Weight", Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.module3Weight}
                  onChange={(e) => handleChange("module3Weight", Number(e.target.value))}
                  className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                />
                <span className="text-sm font-medium text-gray-500 w-8">%</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Indicators</h3>

              {/* Good Indicator Bonus */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Good Indicator Bonus
                </label>
                <p className="mt-1 text-xs text-gray-500">Points added when good indicators are present</p>
                <div className="mt-3 flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={config.goodIndicatorBonus}
                    onChange={(e) => handleChange("goodIndicatorBonus", Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={config.goodIndicatorBonus}
                    onChange={(e) => handleChange("goodIndicatorBonus", Number(e.target.value))}
                    className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                  />
                  <span className="text-sm font-medium text-gray-500 w-8">pts</span>
                </div>
              </div>

              {/* Bad Indicator Penalty */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900">
                  Bad Indicator Penalty
                </label>
                <p className="mt-1 text-xs text-gray-500">Points deducted when red flags are present</p>
                <div className="mt-3 flex items-center gap-4">
                  <input
                    type="range"
                    min="-50"
                    max="0"
                    value={config.badIndicatorPenalty}
                    onChange={(e) => handleChange("badIndicatorPenalty", Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="-50"
                    max="0"
                    value={config.badIndicatorPenalty}
                    onChange={(e) => handleChange("badIndicatorPenalty", Number(e.target.value))}
                    className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                  />
                  <span className="text-sm font-medium text-gray-500 w-8">pts</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !isValidTotal}
            className="mt-8 flex items-center gap-2 rounded-lg bg-[#3CB3A2] px-6 py-2 text-sm font-medium text-white hover:bg-[#2fa496] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
