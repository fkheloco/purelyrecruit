# Airtable to Neon Migration Guide

## Overview

This guide provides comprehensive instructions for migrating data from Airtable to the Neon PostgreSQL database used by Purely Recruit.

**Migration Date:** As needed
**Source:** Airtable Base ID `appjRIYMHpzycxDRU`
**Target:** Neon PostgreSQL (via Drizzle ORM)
**Data Volume:** ~Applicants, Job Openings, Scoring Records, Skill Taxonomy

---

## Pre-Migration Checklist

- [ ] Airtable API key generated and stored in `.env.local`
- [ ] Neon PostgreSQL database URL available in `.env.local`
- [ ] Database schema migrations run (`npx drizzle-kit migrate`)
- [ ] Backup of current Airtable data (export CSV/JSON if needed)
- [ ] Backup of current Neon database (if migrating existing data)
- [ ] All team members notified of migration timing
- [ ] Dev/staging environment prepared for testing
- [ ] Production database backed up before live migration

---

## Environment Setup

### 1. Airtable API Key

Generate a Personal Access Token in Airtable:

1. Go to https://airtable.com/account/tokens
2. Create a new personal access token with these scopes:
   - `data.records:read` (read records)
3. Copy the token and add to `.env.local`:

```env
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
```

### 2. Database URL

Ensure you have the Neon PostgreSQL connection string in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
```

### 3. Run Database Migrations

Before running the Airtable migration, ensure your Neon database schema is up-to-date:

```bash
npx drizzle-kit migrate
```

---

## Migration Options

### Option 1: Full Drizzle ORM Migration (Recommended)

This approach uses the full Next.js build and Drizzle ORM for type-safe migrations.

**Prerequisites:**
- Next.js build dependencies installed
- TypeScript compiled
- All environment variables set

**Usage:**

```bash
npm run migrate:airtable
```

**Output:**
- Console logs showing progress for each table
- Migration summary report printed to console
- Summary saved to `migration-summary.txt`

**Advantages:**
- Type-safe Drizzle ORM operations
- Full integration with existing database schema
- Validation through TypeScript
- Detailed error handling and reporting

---

### Option 2: Standalone Migration (Alternative)

This approach uses raw Neon database access without the full Next.js build. Useful for one-off migrations or CI/CD pipelines.

**Prerequisites:**
- Node.js runtime
- `tsx` package installed (added to devDependencies)
- All environment variables set

**Usage:**

```bash
npm run migrate:airtable:standalone
```

**Output:**
- Same console logs and summary as Option 1
- No Next.js build required
- Faster execution for simple migrations

**Advantages:**
- No Next.js build overhead
- Can run in limited CI/CD environments
- Lightweight and fast
- Independent of application code

---

## Migration Process

### Step-by-Step

The migration script performs the following steps in order:

#### 1. Validation
- Checks for required environment variables (`AIRTABLE_API_KEY`, `DATABASE_URL`)
- Validates database connectivity

#### 2. Tenant Creation
- Creates or retrieves the default tenant "Purely Works"
- Used as the organization container for all migrated data
- **Tenant ID:** Stored in `migrationState.tenantId` for reference

#### 3. Skill Taxonomy Migration
- **Source Tables:**
  - Soft Skills (4 fields per record)
  - Hard Skills (4 fields per record)
  - Software (4 fields per record)
  - Certificates (4 fields per record)
- **Target:** `skills` table
- **Mapping:**
  - Soft Skills → category: `soft_skill`
  - Hard Skills → category: `hard_skill`
  - Software → category: `software`
  - Certificates → category: `certificate`
- **Airtable ID → UUID Mapping:** Stored for linking in later steps

#### 4. Candidates Migration
- **Source:** Applicants table (32 fields per record)
- **Targets:**
  - `candidates` table (personal info, experience, location)
  - `resumes` table (resume text content)
  - `candidate_skills` table (skill links)

**Field Mapping:**

| Airtable Field | Target Column | Notes |
|---|---|---|
| First Name | first_name | Required |
| Last Name | last_name | Optional |
| Email | email | Required, generated if missing |
| Phone | phone | Optional |
| Professional Title | current_title | Optional |
| LinkedIn | linkedin_url | Optional |
| Mailing Address | location_city, location_state | Parsed from address string |
| Work Format Preference | availability | Mapped to enum |
| Total Experience | years_experience | Calculated or direct |
| Experience Year Started | years_experience | Calculated as current_year - year_started |
| Salary | salary_expectation_min/max | Min = salary * 0.9, Max = salary |
| Recruiting Source | source | Default: "airtable_migration" |
| Full Text Resume | resumes.raw_text | Creates resume record |
| Skills (linked) | candidate_skills | Links all skill types |

**Availability Mapping:**

| Airtable Value | Target Enum | Notes |
|---|---|---|
| immediate | immediate | Available now |
| 2 weeks | two_weeks | 2 week notice |
| 1 month | one_month | 1 month notice |
| 3 months | three_months | 3 month notice |
| not looking | not_looking | Default |

#### 5. Job Openings Migration
- **Source:** Job Openings table (30+ fields per record)
- **Targets:**
  - `job_openings` table (job details, location, status)
  - `job_skill_requirements` table (skill links with importance)

**Field Mapping:**

| Airtable Field | Target Column | Notes |
|---|---|---|
| Title | title | Job title |
| Job Description | description | Full description |
| Stage | status | Mapped to enum |
| Onsite/Hybrid/Remote | location_type | Mapped to enum |
| Location City/State | location_city, location_state | Direct mapping |
| Candidate Rate | salary_min | Converted to annual (rate * 1000) |
| Good Things to Look For | good_indicators | Array of indicators |
| Bad Things to Watch Out | bad_indicators | Array of indicators |
| Linked Skills | job_skill_requirements | With importance level |

**Status Mapping:**

| Airtable Stage | Target Status | Notes |
|---|---|---|
| active | active | Job is open |
| open | active | Alternative value |
| draft | draft | Not yet published |
| pending | draft | Not yet ready |
| paused | paused | Temporarily closed |
| closed | closed | No longer accepting |
| filled | filled | Position filled |

**Location Type Mapping:**

| Airtable Value | Target Enum | Notes |
|---|---|---|
| Remote | remote | Work from anywhere |
| Hybrid | hybrid | Mixed remote/office |
| Onsite | onsite | Office required |

**Skill Importance Mapping:**

| Airtable Field Category | Target Importance | Notes |
|---|---|---|
| Mandatory fields | mandatory | Must have |
| Required fields | required | Should have |
| Optional fields | optional | Nice to have |

#### 6. Scoring Records → Applications
- **Source:** Scoring Records table (19 fields per record)
- **Target:** `applications` table

**Field Mapping:**

| Airtable Field | Target Column | Notes |
|---|---|---|
| Name | Derived | Not stored directly |
| Final Overall Score | final_score | Parsed as decimal |
| Weighted Score | weighted_score | Parsed as decimal |
| Score Based on Job Description | score_module_1 | Module 1 score |
| Score Based on Questions | score_module_2 | Module 2 score |
| Recruiter Score | recruiter_score | Parsed as decimal |
| Status | status | Mapped to enum |
| Recruiter Notes | recruiter_notes | Text feedback |
| AI Based Notes | ai_notes | AI analysis text |
| AI Recommendation | ai_recommendation | AI recommendation text |
| Recruiter Decision | recruiter_decision | Decision text |
| Total Flags | missing_mandatory_count | Count of missing criteria |
| Applicants (linked) | candidate_id | Resolved via migration map |
| Job Openings (linked) | job_opening_id | Resolved via migration map |

**Application Status Mapping:**

| Airtable Status | Target Status | Notes |
|---|---|---|
| new | new | New application |
| reviewed | reviewed | Reviewed by recruiter |
| submitted | new | Submitted state |
| pending | new | Pending state |
| shortlisted | shortlisted | Moved forward |
| rejected | rejected | Not progressing |
| offered | offered | Job offer extended |
| hired | hired | Candidate hired |

---

## Data Integrity Checks

### During Migration

- **Skill Links:** Validates that linked skills exist in skill map before linking
- **Candidate References:** Checks that candidates exist before creating applications
- **Job References:** Checks that jobs exist before creating skill requirements
- **Email Validation:** Generates default email if missing (format: `unknown-{airtable_id}@purely-recruit.local`)
- **Required Fields:** Provides sensible defaults for optional fields

### After Migration

Verify the migration with these SQL queries:

```sql
-- Count total skills
SELECT COUNT(*) as total_skills, category, COUNT(DISTINCT category) as categories
FROM skills
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY category;

-- Count candidates with resumes
SELECT COUNT(DISTINCT c.id) as candidates_with_resumes
FROM candidates c
JOIN resumes r ON c.id = r.candidate_id
WHERE c.created_at >= NOW() - INTERVAL '1 day';

-- Count job openings with skill requirements
SELECT COUNT(DISTINCT j.id) as jobs_with_skills
FROM job_openings j
LEFT JOIN job_skill_requirements jsr ON j.id = jsr.job_opening_id
WHERE j.created_at >= NOW() - INTERVAL '1 day';

-- Count applications
SELECT COUNT(*) as total_applications, status, COUNT(DISTINCT status) as statuses
FROM applications
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY status;

-- Verify tenant
SELECT * FROM tenants WHERE slug = 'purely-works';
```

---

## Error Handling

### Migration Continues on Errors

The migration script is designed to continue processing even if individual records fail. This allows partial success even if there are data quality issues.

**Error Handling Strategy:**

1. **Individual Record Errors:** Logged to console, counter incremented, migration continues
2. **Relationship Errors:** Record skipped if parent reference missing, logged as warning
3. **Fatal Errors:** Script exits with code 1, full error message printed

**Common Error Scenarios:**

| Scenario | Behavior | Recovery |
|---|---|---|
| Skill link fails | Skipped, error logged | Migration continues with other skills |
| Missing email | Generates default email | Record created with synthetic email |
| Invalid date | Uses current timestamp | Record created with migration date |
| No applicant/job reference | Application skipped | Logged as warning, no data loss |
| Database connection fails | Fatal error | Check DATABASE_URL, retry migration |

### Reviewing Error Logs

After migration completes, check the error count in the summary report:

```
Migration Errors: 0
```

If errors > 0, review console output for entries like:

```
[ERROR] Error migrating applicant abc123: Database error...
```

Fix the underlying issue (data quality, permissions) and re-run migration for those records.

---

## Rollback Procedures

### Before Migration

No action required. All operations are additive.

### After Migration (If Issues Found)

#### Option 1: Delete and Re-run
```sql
DELETE FROM applications WHERE source = 'airtable_migration';
DELETE FROM job_skill_requirements WHERE job_opening_id IN (
  SELECT id FROM job_openings WHERE created_by IS NULL
);
DELETE FROM job_openings WHERE created_by IS NULL;
DELETE FROM candidate_skills WHERE source = 'airtable_migration';
DELETE FROM resumes WHERE source = 'airtable_migration';
DELETE FROM candidates WHERE source = 'airtable_migration';
DELETE FROM skills WHERE created_at >= '2024-XX-XX 00:00:00';
DELETE FROM tenants WHERE slug = 'purely-works';
```

Then re-run migration with fixes.

#### Option 2: Keep in Separate Tenant
If you want to keep migrated data separate from manual entries, create a different tenant:

```typescript
const newTenant = await db
  .insert(tenants)
  .values({
    clerkOrgId: "clerk-org-custom-name",
    name: "Custom Name",
    slug: "custom-slug",
    // ...
  })
  .returning();
```

Then modify migration script to use this tenant ID.

---

## Performance Considerations

### Batch Sizes

The script fetches Airtable records in batches of up to 100 per API request (Airtable limit). Database inserts are single-record operations.

**Expected Performance:**
- **Skill Migration:** ~50-100 skills: < 1 second
- **Candidate Migration:** ~100-500 candidates: 5-30 seconds
- **Job Migration:** ~50-200 jobs: 2-10 seconds
- **Scoring Migration:** ~500-1000 applications: 10-60 seconds

**Total:** Full migration typically completes in 1-2 minutes for typical dataset sizes.

### API Rate Limits

Airtable has rate limits: 5 requests/second for reads. The migration script respects this through sequential API calls.

If you get rate limit errors:
1. Wait a minute
2. Re-run the migration script
3. It will continue from where it left off by checking for existing records

---

## Verification Checklist

After migration completes, verify:

- [ ] Migration summary report shows expected counts
- [ ] No "Migration Errors" logged
- [ ] All skills present in database: `SELECT COUNT(*) FROM skills`
- [ ] All candidates present: `SELECT COUNT(*) FROM candidates`
- [ ] Resume files created: `SELECT COUNT(*) FROM resumes`
- [ ] Candidate skills linked: `SELECT COUNT(*) FROM candidate_skills`
- [ ] Jobs present: `SELECT COUNT(*) FROM job_openings`
- [ ] Job skill requirements linked: `SELECT COUNT(*) FROM job_skill_requirements`
- [ ] Applications created: `SELECT COUNT(*) FROM applications`
- [ ] Sample data spot-check in UI matches Airtable

---

## Troubleshooting

### Common Issues

#### 1. "AIRTABLE_API_KEY environment variable is required"

**Problem:** API key not set

**Solution:**
```bash
echo "AIRTABLE_API_KEY=pat_xxxxx" >> .env.local
```

#### 2. "DATABASE_URL environment variable is required"

**Problem:** Database URL not set

**Solution:**
```bash
echo "DATABASE_URL=postgresql://..." >> .env.local
```

#### 3. "Airtable API error: 401 Unauthorized"

**Problem:** Invalid API key

**Solution:**
1. Generate new token at https://airtable.com/account/tokens
2. Update `.env.local` with new token
3. Re-run migration

#### 4. "Airtable API error: 403 Forbidden"

**Problem:** Insufficient permissions on API token

**Solution:**
1. Check API token scopes include `data.records:read`
2. Regenerate token with correct scopes
3. Update `.env.local`
4. Re-run migration

#### 5. "connect ECONNREFUSED 127.0.0.1:5432"

**Problem:** Cannot connect to Neon database

**Solution:**
1. Check DATABASE_URL is correct and reachable
2. Verify VPN/firewall rules if needed
3. Test connection: `psql $DATABASE_URL`
4. Re-run migration

#### 6. Records missing after migration

**Problem:** Some records didn't migrate

**Solution:**
1. Check error count in summary report
2. Review console logs for ERROR entries
3. Check data quality in Airtable (empty required fields)
4. Fix underlying issue
5. Delete partial data and re-run, or run again for just-added records

---

## Post-Migration Tasks

### 1. Verify Data Quality

Run spot checks on random records:

```bash
# Check a candidate
SELECT * FROM candidates LIMIT 1;

# Check skill links
SELECT c.id, COUNT(cs.id) as skill_count
FROM candidates c
LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
GROUP BY c.id
LIMIT 10;

# Check job with skills
SELECT j.id, j.title, COUNT(jsr.id) as skill_count
FROM job_openings j
LEFT JOIN job_skill_requirements jsr ON j.id = jsr.job_opening_id
GROUP BY j.id
LIMIT 10;
```

### 2. Update Application UI

If this is the first migration, ensure the UI displays migrated data correctly:

- [ ] Test candidate list view
- [ ] Test job list view
- [ ] Test application view with scores
- [ ] Test search and filters

### 3. Document Migration

Save the migration summary report and commit it to version control:

```bash
git add migration-summary.txt
git commit -m "feat: completed airtable migration with {count} records"
```

### 4. Archive Airtable

After verification:
- [ ] Archive Airtable base or set to read-only
- [ ] Document migration date
- [ ] Keep as backup reference
- [ ] Update team documentation

---

## Support

### Questions?

Refer to:
- **Airtable API Docs:** https://airtable.com/api
- **Neon Docs:** https://neon.tech/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team

### Script Issues?

Check:
- Script output for specific error messages
- Database logs: `SELECT * FROM pg_stat_statements;`
- Airtable base for data quality issues

---

## Migration Metadata

**Script Files:**
- `/scripts/migrate-from-airtable.ts` - Full Drizzle ORM approach
- `/scripts/migrate-from-airtable-standalone.ts` - Standalone approach

**Database Schema:**
- `/src/db/schema/index.ts` - All schema definitions
- `/src/db/schema/candidates.ts` - Candidate schema
- `/src/db/schema/jobs.ts` - Job opening schema
- `/src/db/schema/applications.ts` - Application schema
- `/src/db/schema/skills.ts` - Skills schema

**Configuration:**
- `package.json` - Migration scripts entry points
- `.env.local` - Environment variables

**Documentation:**
- `AIRTABLE_MIGRATION_GUIDE.md` - This file
- `migration-summary.txt` - Generated after each migration

---

**Last Updated:** February 2026
**Version:** 1.0
**Status:** Production Ready
