# Files Created for Purely Recruit Platform

## AI Library Files (src/lib/ai/)
- client.ts - Anthropic SDK initialization and model constants
- resume-parser.ts - Resume parsing with Claude AI
- scoring.ts - Application scoring with weighted modules
- job-description.ts - AI-powered job description generation
- matching.ts - Talent pool matching with PostgreSQL full-text search
- embeddings.ts - Embedding placeholder (uses full-text search)

## API Routes

### Candidate Management
- src/app/api/candidates/route.ts - List/create candidates
- src/app/api/candidates/[id]/route.ts - Get/update candidate

### Job Management
- src/app/api/jobs/route.ts - List/create job openings
- src/app/api/jobs/[id]/route.ts - Get/update job

### Applications
- src/app/api/applications/route.ts - List/create applications
- src/app/api/applications/[id]/route.ts - Get/update application

### Communication
- src/app/api/messages/route.ts - In-app messaging
- src/app/api/notes/route.ts - Candidate/application notes

### Notifications
- src/app/api/notifications/route.ts - Notification management

### Search
- src/app/api/search/route.ts - Full-text search for candidates/jobs

### File Upload
- src/app/api/upload/route.ts - Resume file upload to Vercel Blob

### AI Endpoints
- src/app/api/ai/score/route.ts - Queue application scoring
- src/app/api/ai/generate-jd/route.ts - Generate job descriptions
- src/app/api/ai/match/route.ts - Match talent to positions
- src/app/api/ai/parse-resume/route.ts - Queue resume parsing

### Cron Jobs
- src/app/api/cron/process-jobs/route.ts - Process queued AI jobs
- src/app/api/cron/daily-digest/route.ts - Daily digest notifications
- src/app/api/cron/weekly-cleanup/route.ts - Cleanup old job queue records

### Tenant Management
- src/app/api/tenants/route.ts - List tenants
- src/app/api/tenants/[id]/route.ts - Get/update tenant
- src/app/api/tenants/[id]/scoring-config/route.ts - Get/set scoring weights

### Analytics
- src/app/api/analytics/tenant/route.ts - Tenant-level analytics
- src/app/api/analytics/platform/route.ts - Platform-wide analytics

## Total Files Created: 30

### Breakdown:
- AI Library: 6 files
- API Routes: 24 files
