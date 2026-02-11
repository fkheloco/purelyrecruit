# Purely Recruit Database Schema Setup

All database schema files and configuration have been created. Here's what was set up:

## Files Created

### Database Client
- **src/db/index.ts** — Drizzle ORM database client with Neon serverless support

### Configuration
- **drizzle.config.ts** — Drizzle Kit migration configuration

### Schema Files (16 tables)
1. **src/db/schema/tenants.ts** — Multi-tenant organization data
2. **src/db/schema/users.ts** — Platform users with role-based access
3. **src/db/schema/skills.ts** — Skill taxonomy and reference data
4. **src/db/schema/candidates.ts** — Candidate profiles with scoring
5. **src/db/schema/resumes.ts** — Resume documents and parsed data
6. **src/db/schema/candidate-skills.ts** — Candidate skill proficiencies
7. **src/db/schema/jobs.ts** — Job openings with status tracking
8. **src/db/schema/job-skill-requirements.ts** — Job skill requirements matrix
9. **src/db/schema/applications.ts** — Job applications with scoring modules
10. **src/db/schema/scoring-configs.ts** — Tenant-specific AI scoring configuration
11. **src/db/schema/notes.ts** — Internal notes on candidates and applications
12. **src/db/schema/messages.ts** — Communication threads (in-app, email, SMS)
13. **src/db/schema/notifications.ts** — User notifications
14. **src/db/schema/job-queue.ts** — Background job queue for async processing
15. **src/db/schema/analytics.ts** — Reporting and metrics snapshots
16. **src/db/schema/embeddings.ts** — Vector embeddings for AI matching

### Schema Index
- **src/db/schema/index.ts** — Barrel export of all schemas

### Post-Migration Setup
- **scripts/setup-extensions.sql** — PostgreSQL extensions and vector indexes

## Key Features

### Multi-Tenant Architecture
- Tenants table with custom branding (colors, domains)
- Role-based user access (platform_admin, recruiter, client_admin, client_user, candidate)
- Tenant-scoped data isolation

### AI-Powered Recruiting
- Three-module scoring system for applications (configurable weights)
- Skill matching with proficiency levels and years of experience
- Good/bad indicator detection with configurable penalties/bonuses
- Resume parsing with extracted skills, experience, education, certifications
- Vector embeddings for semantic matching (pgvector support)

### Application Pipeline
- Status tracking: new → ai_processing → scored → reviewed → shortlisted → interviewing → offered → hired/rejected
- Multiple source attribution: direct_apply, job_board, talent_pool_match, recruiter_suggested, referral, ai_matched
- Comprehensive scoring: module scores, final score, weighted score, AI recommendation
- Client and recruiter feedback loops

### Communication & Collaboration
- In-app, email, and SMS messaging with threading
- Note visibility control (internal, client, candidate)
- Notification system with type-based routing
- Author attribution and role tracking

### Job Management
- Job status: draft, active, paused, closed, filled
- Location types: onsite, remote, hybrid
- Employment types: full_time, part_time, contract, temp, intern
- Job board integration with external IDs
- Skill requirements matrix (mandatory, required, optional)

### Performance Features
- Full-text search indexes on candidates and jobs (GIN)
- Vector similarity search with pgvector (HNSW)
- Async job queue for background processing (resumes, scoring, enrichment)

## Environment Variables Required

```env
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
DATABASE_URL_DIRECT=postgresql://user:password@host/db?sslmode=require
```

(For Neon: DATABASE_URL_DIRECT uses the direct connection string without pgBouncer)

## Next Steps

1. **Apply Migrations**
   ```bash
   npx drizzle-kit migrate
   ```

2. **Run Post-Migration Setup** (in Neon SQL Editor)
   ```sql
   -- Copy contents from scripts/setup-extensions.sql
   ```

3. **Generate Types** (automatic on migration)
   ```bash
   npx drizzle-kit generate
   ```

4. **Use in Code**
   ```typescript
   import { db } from "@/db";
   import { candidates, applications, jobs } from "@/db/schema";
   
   // Query example
   const topCandidates = await db
     .select()
     .from(candidates)
     .where(...)
     .limit(10);
   ```

## Schema Design Notes

- All IDs are UUIDs (auto-generated)
- All timestamps are UTC with `defaultNow()`
- Foreign key references use `onDelete: "cascade"` for dependent data
- Soft references use `onDelete: "set null"` where historical data matters
- Enums are PostgreSQL native for type safety
- JSONB columns for flexible metadata (enrichment data, custom weights, etc.)
- Arrays used for repeating simple values (skills, locations, etc.)
- Full-text search vectors pre-computed for performance

## Tables Summary

| Table | Records | Primary Key | Purpose |
|-------|---------|------------|---------|
| tenants | 10s | UUID | Multi-tenant orgs |
| users | 100s | UUID | Platform users |
| skills | 1000s | UUID | Skill catalog |
| candidates | 10000s | UUID | Talent pool |
| resumes | 10000s | UUID | Resume files + parsed data |
| candidate_skills | 100000s | UUID | Candidate skill proficiencies |
| jobs | 100s | UUID | Open positions |
| job_skill_requirements | 1000s | UUID | Job skill matrix |
| applications | 100000s | UUID | Job applications |
| scoring_configs | 10s | UUID | Tenant-specific weights |
| notes | 100000s | UUID | Collaboration notes |
| messages | 1000000s | UUID | Communication threads |
| notifications | 1000000s | UUID | User notifications |
| job_queue | 10000s | UUID | Background jobs |
| analytics | 1000s | UUID | Metrics snapshots |
| candidate_embeddings | 10000s | UUID | Candidate vectors |
| job_embeddings | 100s | UUID | Job vectors |

