export const UserRoles = ["platform_admin", "recruiter", "client_admin", "client_user", "candidate"] as const;
export type UserRole = (typeof UserRoles)[number];

export const ApplicationStatuses = ["new", "ai_processing", "scored", "reviewed", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn"] as const;
export type ApplicationStatus = (typeof ApplicationStatuses)[number];

export const JobStatuses = ["draft", "active", "paused", "closed", "filled"] as const;
export type JobStatus = (typeof JobStatuses)[number];

export const ImportanceLevels = ["mandatory", "required", "optional"] as const;
export type ImportanceLevel = (typeof ImportanceLevels)[number];

export const AvailabilityLevels = ["immediate", "two_weeks", "one_month", "three_months", "not_looking"] as const;
export type AvailabilityLevel = (typeof AvailabilityLevels)[number];
