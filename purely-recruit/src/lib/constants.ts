export const APP_NAME = "Purely Recruit";

export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  RECRUITER: "recruiter",
  CLIENT_ADMIN: "client_admin",
  CLIENT_USER: "client_user",
  CANDIDATE: "candidate",
} as const;

export const APPLICATION_STATUSES = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "ai_processing", label: "AI Processing", color: "bg-purple-100 text-purple-800" },
  { value: "scored", label: "Scored", color: "bg-indigo-100 text-indigo-800" },
  { value: "reviewed", label: "Reviewed", color: "bg-cyan-100 text-cyan-800" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-emerald-100 text-emerald-800" },
  { value: "interviewing", label: "Interviewing", color: "bg-amber-100 text-amber-800" },
  { value: "offered", label: "Offered", color: "bg-yellow-100 text-yellow-800" },
  { value: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
] as const;

export const JOB_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
  { value: "filled", label: "Filled" },
] as const;

export const SCORE_COLORS = {
  excellent: { min: 85, color: "text-green-600", bg: "bg-green-100", label: "Excellent" },
  strong: { min: 70, color: "text-emerald-600", bg: "bg-emerald-100", label: "Strong" },
  good: { min: 55, color: "text-blue-600", bg: "bg-blue-100", label: "Good" },
  fair: { min: 40, color: "text-amber-600", bg: "bg-amber-100", label: "Fair" },
  weak: { min: 0, color: "text-red-600", bg: "bg-red-100", label: "Weak" },
} as const;

export function getScoreCategory(score: number | null) {
  if (score === null || score === undefined) return null;
  if (score >= 85) return SCORE_COLORS.excellent;
  if (score >= 70) return SCORE_COLORS.strong;
  if (score >= 55) return SCORE_COLORS.good;
  if (score >= 40) return SCORE_COLORS.fair;
  return SCORE_COLORS.weak;
}
