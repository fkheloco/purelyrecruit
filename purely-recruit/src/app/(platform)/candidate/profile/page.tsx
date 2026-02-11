"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FileUpload } from "@/components/shared/file-upload";
import { Save, Loader2 } from "lucide-react";

interface CandidateProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  locationCity: string | null;
  locationState: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  yearsExperience: number | null;
  salaryExpectationMin: number | null;
  salaryExpectationMax: number | null;
  availability: string;
  bio: string | null;
}

interface Skill {
  id: string;
  skillId: string;
  name: string;
  proficiency: string;
}

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately" },
  { value: "two_weeks", label: "2 Weeks" },
  { value: "one_month", label: "1 Month" },
  { value: "three_months", label: "3 Months" },
  { value: "not_looking", label: "Not Looking" },
];

const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState("intermediate");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await fetch("/api/candidates?self=true");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setProfile(data.data[0]);
        // Fetch candidate skills
        fetchSkills(data.data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSkills(candidateId: string) {
    try {
      const res = await fetch(`/api/candidates/${candidateId}/skills`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    }
  }

  async function handleSave() {
    if (!profile) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/candidates/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          locationCity: profile.locationCity,
          locationState: profile.locationState,
          linkedinUrl: profile.linkedinUrl,
          portfolioUrl: profile.portfolioUrl,
          currentTitle: profile.currentTitle,
          currentCompany: profile.currentCompany,
          yearsExperience: profile.yearsExperience ? parseInt(String(profile.yearsExperience)) : null,
          salaryExpectationMin: profile.salaryExpectationMin,
          salaryExpectationMax: profile.salaryExpectationMax,
          availability: profile.availability,
          bio: profile.bio,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      const res = await fetch("/api/candidates/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: profile?.id,
          name: newSkill,
          proficiency: newSkillProficiency,
        }),
      });

      if (!res.ok) throw new Error("Failed to add skill");
      const data = await res.json();
      setSkills([...skills, data.data]);
      setNewSkill("");
      setNewSkillProficiency("intermediate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
    }
  }

  async function handleRemoveSkill(skillId: string) {
    try {
      const res = await fetch(`/api/candidates/skills/${skillId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove skill");
      setSkills(skills.filter((s) => s.id !== skillId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove skill");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CB3A2]" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">No profile data found</div>;
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your profile information and skills"
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="grid gap-8">
        {/* Personal Information */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={profile.locationCity || ""}
                onChange={(e) =>
                  setProfile({ ...profile, locationCity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={profile.locationState || ""}
                onChange={(e) =>
                  setProfile({ ...profile, locationState: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Professional Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Title
              </label>
              <input
                type="text"
                value={profile.currentTitle || ""}
                onChange={(e) =>
                  setProfile({ ...profile, currentTitle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Company
              </label>
              <input
                type="text"
                value={profile.currentCompany || ""}
                onChange={(e) =>
                  setProfile({ ...profile, currentCompany: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={profile.yearsExperience || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    yearsExperience: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedinUrl || ""}
                onChange={(e) =>
                  setProfile({ ...profile, linkedinUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio URL
              </label>
              <input
                type="url"
                value={profile.portfolioUrl || ""}
                onChange={(e) =>
                  setProfile({ ...profile, portfolioUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={profile.availability}
                onChange={(e) =>
                  setProfile({ ...profile, availability: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Salary Expectations
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                min="0"
                value={profile.salaryExpectationMin || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salaryExpectationMin: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                min="0"
                value={profile.salaryExpectationMax || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salaryExpectationMax: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Professional Summary
          </h2>

          <textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={6}
            placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
          />
        </div>

        {/* Skills */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Skills</h2>

          <div className="mb-6">
            <form onSubmit={handleAddSkill} className="flex gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              />
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3CB3A2] text-white font-medium rounded-lg hover:bg-[#35a096] transition"
              >
                Add
              </button>
            </form>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{skill.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{skill.proficiency}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="ml-2 text-gray-400 hover:text-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No skills added yet</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#3CB3A2] text-white font-medium rounded-lg hover:bg-[#35a096] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
