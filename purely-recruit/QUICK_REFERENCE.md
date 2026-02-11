# Purely Recruit - Quick Reference Guide

## Files Created - Quick Import Guide

### Utilities & Helpers
```typescript
import { cn, formatDate, formatCurrency, getInitials, truncate } from "@/lib/utils";
import { APP_NAME, ROLES, APPLICATION_STATUSES, JOB_STATUSES, getScoreCategory } from "@/lib/constants";
```

### Authentication & Authorization
```typescript
import { hasPermission, getPortalForRole } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";
import { getAuthContext, requireRole } from "@/lib/auth/middleware";
import type { AuthContext } from "@/lib/auth/middleware";
```

### Background Jobs
```typescript
import { enqueueJob, claimPendingJobs, completeJob, failJob } from "@/lib/jobs/queue";
import type { JobType } from "@/lib/jobs/queue";
```

### Search & Discovery
```typescript
import { searchCandidates, searchJobs } from "@/lib/search/fulltext";
```

### Notifications
```typescript
import { notify } from "@/lib/notifications/notify";
```

### React Hooks
```typescript
import { useNotifications } from "@/hooks/use-notifications";
import { useTenant } from "@/hooks/use-tenant";
import { useRole } from "@/hooks/use-role";
import { useSearch } from "@/hooks/use-search";
```

### Type Definitions
```typescript
import type { ApiResponse, PaginatedResponse, SearchParams } from "@/types/api";
import type { UserRole, ApplicationStatus, JobStatus, ImportanceLevel, AvailabilityLevel } from "@/types/enums";
import type { Tenant, User, Candidate, Application, JobOpening } from "@/types";
```

## Common Patterns

### Check User Permissions (Server)
```typescript
const auth = await getAuthContext();
if (!auth) return unauthorized();
if (requireRole(auth, ROLES.CLIENT_ADMIN)) return forbidden();
```

### Search Candidates
```typescript
const results = await searchCandidates("React Developer", {
  locationState: "CA",
  minExperience: 3,
});
```

### Enqueue Background Job
```typescript
await enqueueJob("score-application", {
  applicationId: "123",
  jobId: "456",
}, 5000); // 5 second delay
```

### Use Notifications (Client)
```typescript
const { notifications, unreadCount, markAsRead } = useNotifications(30000);
```

### Create Notification
```typescript
await notify({
  userId: "user-123",
  tenantId: "tenant-456",
  type: "application_scored",
  title: "Application Scored",
  body: "Your application has been scored",
  referenceType: "application",
  referenceId: "app-123",
});
```

## Role-Based Access Control

### Available Roles
- `platform_admin` - Full system access
- `recruiter` - Recruiter dashboard access
- `client_admin` - Client admin access
- `client_user` - Client user access (read-only)
- `candidate` - Candidate portal access

### Permission Check
```typescript
if (hasPermission(userRole, "createJob")) {
  // Allow job creation
}
```

### Default Portal Routes
- Admin/Recruiter → `/recruiter/dashboard`
- Client Admin/User → `/client/dashboard`
- Candidate → `/candidate/profile`

## Application Status Flow
```
new → ai_processing → scored → reviewed → shortlisted → interviewing → offered → hired/rejected
                                           withdrawn
```

## Score Categories
- **Excellent** (85+) - `text-green-600`
- **Strong** (70-84) - `text-emerald-600`
- **Good** (55-69) - `text-blue-600`
- **Fair** (40-54) - `text-amber-600`
- **Weak** (<40) - `text-red-600`

## Middleware Configuration
- Public routes: `/`, `/sign-in`, `/sign-up`, `/jobs/*`, webhooks, cron
- Protected routes: Everything else requires Clerk authentication
- Webhook endpoints are excluded from auth protection

## Environment Variables Required
- `CLERK_WEBHOOK_SECRET` - For webhook verification
- `RESEND_API_KEY` - Optional, for email notifications
- `DATABASE_URL` - PostgreSQL connection string

## File Structure Summary
```
16 files total across 4 main categories:
- 7 library files (utils, constants, auth, jobs, search, notifications)
- 4 hook files (notifications, tenant, role, search)
- 3 type files (index, api, enums)
- 1 API webhook handler
- 1 root middleware configuration
```

All files are production-ready and fully typed with TypeScript.
