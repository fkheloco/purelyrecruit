# Airtable Migration - Quick Start Guide

## 5-Minute Setup

### 1. Get Airtable API Key
- Go to https://airtable.com/account/tokens
- Create new token with `data.records:read` scope
- Copy the token

### 2. Update Environment
```bash
# Add to .env.local
echo "AIRTABLE_API_KEY=pat_your_key_here" >> .env.local
```

**Note:** `DATABASE_URL` should already be in `.env.local`

### 3. Run Database Migrations
```bash
npx drizzle-kit migrate
```

### 4. Install Dependencies (first time only)
```bash
npm install
```

---

## Run Migration

### Option A: Full Drizzle ORM (Recommended)
```bash
npm run migrate:airtable
```

### Option B: Standalone (No build)
```bash
npm run migrate:airtable:standalone
```

---

## Expected Output

```
2026-02-11T12:34:56.789Z [INFO] Environment validation passed
2026-02-11T12:34:57.123Z [SUCCESS] Created default tenant: 550e8400-e29b-41d4-a716-446655440000
2026-02-11T12:34:57.456Z [INFO] Starting skill taxonomy migration...
2026-02-11T12:34:58.789Z [SUCCESS] Completed skill migration: 45 skills created
2026-02-11T12:34:59.123Z [INFO] Starting candidate migration...
2026-02-11T12:35:15.456Z [SUCCESS] Completed candidate migration: 125 candidates, 95 resumes, 387 skill links created
2026-02-11T12:35:16.789Z [INFO] Starting job opening migration...
2026-02-11T12:35:18.123Z [SUCCESS] Completed job opening migration: 28 jobs, 156 skill requirements created
2026-02-11T12:35:19.456Z [INFO] Starting scoring records migration...
2026-02-11T12:35:22.789Z [SUCCESS] Completed scoring records migration: 342 applications created

================================================================================
                    AIRTABLE MIGRATION SUMMARY REPORT
================================================================================

Statistics:
-----------
Skills Created:                45
Candidates Created:            125
Resumes Created:               95
Candidate Skills Created:      387
Job Openings Created:          28
Job Skill Requirements:        156
Applications Created:          342
Migration Errors:              0

================================================================================
```

---

## Verify Success

```bash
# Check if data was migrated (run in database)
SELECT COUNT(*) FROM candidates;
SELECT COUNT(*) FROM job_openings;
SELECT COUNT(*) FROM applications;
```

---

## What Gets Migrated

| Source (Airtable) | Target (Neon) | Fields |
|---|---|---|
| Soft Skills table | skills table | Name, Description |
| Hard Skills table | skills table | Name, Category |
| Software table | skills table | Name, Category |
| Certificates table | skills table | Name, Category |
| Applicants table | candidates + resumes + candidate_skills | 32 fields |
| Job Openings table | job_openings + job_skill_requirements | 30+ fields |
| Scoring Records table | applications | 19 fields |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "AIRTABLE_API_KEY not found" | Add token to .env.local |
| "DATABASE_URL not found" | Ensure it's in .env.local |
| "401 Unauthorized" | Check API token is valid and not expired |
| "Permission denied" | Token needs `data.records:read` scope |
| Database connection error | Check DATABASE_URL is reachable |
| 0 records migrated | Check Airtable base ID and table IDs |

---

## What Happens After

1. **Summary report** saved to `migration-summary.txt`
2. **Data** available in PostgreSQL immediately
3. **IDs** mapped for auditing (Airtable ID → PostgreSQL UUID)
4. **Relationships** maintained (candidates → skills, jobs → requirements, etc.)
5. **Timestamps** preserved (creation dates from Airtable)

---

## Next Steps

- [ ] Review `migration-summary.txt`
- [ ] Run verification queries above
- [ ] Test in web UI to see migrated data
- [ ] Archive Airtable base

---

## Files Created

- `scripts/migrate-from-airtable.ts` - Main migration script
- `scripts/migrate-from-airtable-standalone.ts` - Standalone version
- `AIRTABLE_MIGRATION_GUIDE.md` - Detailed guide (this document's full version)
- `AIRTABLE_MIGRATION_QUICK_START.md` - This quick reference

---

**Need help?** See `AIRTABLE_MIGRATION_GUIDE.md` for detailed instructions.
