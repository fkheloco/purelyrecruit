import { ROLES } from "@/lib/constants";

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // Recruiter permissions
  viewAllCandidates: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER],
  viewAllJobs: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER],
  viewAllApplications: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER],
  manageTenants: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER],
  viewAnalytics: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER],
  
  // Client permissions
  viewTenantJobs: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER, ROLES.CLIENT_ADMIN, ROLES.CLIENT_USER],
  createJob: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER, ROLES.CLIENT_ADMIN],
  viewTenantCandidates: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER, ROLES.CLIENT_ADMIN, ROLES.CLIENT_USER],
  configureScoringWeights: [ROLES.PLATFORM_ADMIN, ROLES.RECRUITER, ROLES.CLIENT_ADMIN],
  
  // Candidate permissions
  applyToJob: [ROLES.CANDIDATE],
  viewOwnApplications: [ROLES.CANDIDATE],
  editOwnProfile: [ROLES.CANDIDATE],
} as const;

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function getPortalForRole(role: UserRole): string {
  switch (role) {
    case ROLES.PLATFORM_ADMIN:
    case ROLES.RECRUITER:
      return "/recruiter/dashboard";
    case ROLES.CLIENT_ADMIN:
    case ROLES.CLIENT_USER:
      return "/client/dashboard";
    case ROLES.CANDIDATE:
      return "/candidate/profile";
    default:
      return "/";
  }
}
