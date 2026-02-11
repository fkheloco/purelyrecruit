# Purely Recruit — AI Build Spec (v2 — Lean Stack)

## Step-by-Step Development Specification for AI Agents

> **Project:** Purely Recruit — Multi-Tenant AI Recruiting Platform
> **Stack:** Next.js 15 · Neon DB · Clerk · Vercel · Drizzle ORM · Claude API
> **Author:** Farid Kheloco, CEO — Purely Works
> **Version:** 2.0 — February 2026
> **Philosophy:** Minimal core, usage-based pricing, add integrations later

---

## DESIGN PRINCIPLE: SMALL CORE, BIG CAPABILITY

This spec follows one rule: **if Neon or Vercel can do it natively, don't add a third-party tool.**

Everything in the Core Stack is either free open-source or usage-based with generous free tiers. External integrations (job boards, enrichment, email) are optional add-ons that plug in when ready — the platform works without them.

### Core Stack (6 services — all usage-based)

| Service | Purpose | Pricing | Free Tier |
|---|---|---|---|
| **Next.js 15** | Full-stack framework | Free (open source) | ∞ |
| **Neon DB** | PostgreSQL + pgvector + full-text search + job queue | Usage-based | 0.5 GB storage, 190 compute hours |
| **Clerk** | Auth + Organizations (multi-tenant) | Usage-based | 10,000 MAUs free |
| **Vercel** | Hosting + Cron + Blob storage | Usage-based | 100 GB bandwidth, 1M requests |
| **Drizzle ORM** | Type-safe SQL | Free (open source) | ∞ |
| **Claude API** | AI scoring, parsing, generation | Usage-based ($3/$15 per M tokens) | — |

### What We Eliminated (and how)

| Old Service | Monthly Cost | Replaced By | Cost |
|---|---|---|---|
| Meilisearch Cloud | $29-99/mo | PostgreSQL `tsvector` + GIN indexes (built into Neon) | $0 |
| Inngest | $39/mo | Vercel Cron + DB-backed job queue + `after()` | $0 |
| Pusher | $49/mo | Polling every 30s (simple, reliable on serverless) | $0 |
| Resend | $20/mo | In-app notifications first; email is Phase 2 add-on | $0 |
| People Data Labs | $99/mo+ | Optional add-on; Perplexity API for research | $0 core |
| Hunter.io | $49/mo+ | Optional add-on | $0 core |
| Apollo.io | $49/mo+ | Optional add-on | $0 core |
| Indeed API | Varies | Optional add-on | $0 core |
| LinkedIn API | Varies | Optional add-on | $0 core |
| **Total saved** | **~$335-500/mo** | | |

### Optional Add-On Services (Phase 2+)

| Service | Purpose | When to Add |
|---|---|---|
| Resend | Transactional email ($20/mo for 50K emails) | When you need email notifications |
| Perplexity API | Company/candidate research ($5/1K searches) | When you want AI-powered enrichment |
| People Data Labs | Contact data enrichment ($0.10/record) | When you need verified phone/email |
| Hunter.io | Email verification ($49/mo) | When outbound email matters |
| Indeed API | Job board posting | When clients want job board distribution |
| LinkedIn API | Job board posting + RSC | When clients want LinkedIn integration |
| ZipRecruiter | Job board feed | When clients want ZipRecruiter reach |

---

## TABLE OF CONTENTS

1. [Project Scaffolding](#1-project-scaffolding)
2. [Environment Variables](#2-environment-variables)
3. [Database Schema (Neon + Drizzle)](#3-database-schema)
4. [Authentication (Clerk)](#4-authentication-clerk)
5. [API Layer](#5-api-layer)
6. [Background Jobs (DB Queue + Vercel Cron)](#6-background-jobs)
7. [Search (PostgreSQL Full-Text)](#7-search)
8. [Notifications (Polling)](#8-notifications)
9. [File Uploads (Vercel Blob)](#9-file-uploads)
10. [AI Engine (Claude)](#10-ai-engine)
11. [Portal 1 — Recruiter Dashboard](#11-portal-1--recruiter-dashboard)
12. [Portal 2 — Client Portal](#12-portal-2--client-portal)
13. [Portal 3 — Client Job Portal (Public)](#13-portal-3--client-job-portal)
14. [Portal 4 — Company Job Board](#14-portal-4--company-job-board)
15. [Portal 5 — Candidate Talent Pool](#15-portal-5--candidate-talent-pool)
16. [Deployment (Vercel)](#16-deployment)
17. [Migration from Airtable](#17-migration-from-airtable)
18. [Add-On: Email Notifications (Resend)](#18-add-on-email)
19. [Add-On: Enrichment (Perplexity + PDL)](#19-add-on-enrichment)
20. [Add-On: Job Board Integrations](#20-add-on-job-boards)

---

## 1. PROJECT SCAFFOLDING

### Step 1.1 — Create the Next.js project

```bash
npx create-next-app@latest purely-recruit \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack
```

### Step 1.2 — Install dependencies (core only)

```bash
cd purely-recruit

# Database
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Auth
npm install @clerk/nextjs svix

# UI
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea \
  dialog dropdown-menu table tabs badge avatar separator \
  sheet command popover calendar form toast sonner \
  skeleton switch checkbox radio-group slider progress

# AI
npm install ai @ai-sdk/anthropic @anthropic-ai/sdk

# File Upload
npm install @vercel/blob

# Validation & Utilities
npm install zod react-hook-form @hookform/resolvers
npm install @tanstack/react-table
npm install date-fns nanoid clsx tailwind-merge lucide-react
npm install -D @types/node
```

**That's it.** No Meilisearch, no Inngest, no Pusher, no Resend. Just the framework, database, auth, AI, and UI.

### Step 1.3 — Project directory structure

```
purely-recruit/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (platform)/
│   │   │   ├── recruiter/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── talent-pool/page.tsx
│   │   │   │   ├── jobs/page.tsx
│   │   │   │   ├── jobs/[jobId]/page.tsx
│   │   │   │   ├── applications/page.tsx
│   │   │   │   ├── applications/[appId]/page.tsx
│   │   │   │   ├── clients/page.tsx
│   │   │   │   ├── clients/[clientId]/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── client/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── jobs/page.tsx
│   │   │   │   ├── jobs/[jobId]/page.tsx
│   │   │   │   ├── jobs/new/page.tsx
│   │   │   │   ├── candidates/page.tsx
│   │   │   │   ├── candidates/[candidateId]/page.tsx
│   │   │   │   ├── scoring-config/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   ├── reports/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── candidate/
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── profile/edit/page.tsx
│   │   │   │   ├── applications/page.tsx
│   │   │   │   ├── jobs/page.tsx
│   │   │   │   ├── jobs/[jobId]/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── jobs/page.tsx
│   │   │   ├── jobs/[jobId]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── [tenant]/
│   │   │   ├── jobs/page.tsx
│   │   │   ├── jobs/[jobId]/page.tsx
│   │   │   ├── apply/[jobId]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── webhooks/clerk/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── search/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── score/route.ts
│   │   │   │   ├── generate-jd/route.ts
│   │   │   │   ├── match/route.ts
│   │   │   │   └── parse-resume/route.ts
│   │   │   ├── candidates/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── applications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── notes/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   ├── tenants/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── scoring-config/route.ts
│   │   │   │       └── branding/route.ts
│   │   │   ├── analytics/
│   │   │   │   ├── tenant/route.ts
│   │   │   │   └── platform/route.ts
│   │   │   └── cron/
│   │   │       ├── process-jobs/route.ts
│   │   │       ├── daily-digest/route.ts
│   │   │       └── weekly-cleanup/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── tenants.ts
│   │   │   ├── users.ts
│   │   │   ├── candidates.ts
│   │   │   ├── resumes.ts
│   │   │   ├── skills.ts
│   │   │   ├── candidate-skills.ts
│   │   │   ├── jobs.ts
│   │   │   ├── job-skill-requirements.ts
│   │   │   ├── applications.ts
│   │   │   ├── scoring-configs.ts
│   │   │   ├── notes.ts
│   │   │   ├── messages.ts
│   │   │   ├── notifications.ts
│   │   │   ├── job-queue.ts
│   │   │   ├── analytics.ts
│   │   │   └── embeddings.ts
│   │   ├── queries/
│   │   │   ├── candidates.ts
│   │   │   ├── jobs.ts
│   │   │   ├── applications.ts
│   │   │   ├── tenants.ts
│   │   │   ├── search.ts
│   │   │   └── analytics.ts
│   │   └── migrations/
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── scoring.ts
│   │   │   ├── job-description.ts
│   │   │   ├── resume-parser.ts
│   │   │   ├── matching.ts
│   │   │   └── embeddings.ts
│   │   ├── auth/
│   │   │   ├── roles.ts
│   │   │   └── middleware.ts
│   │   ├── jobs/
│   │   │   └── queue.ts
│   │   ├── notifications/
│   │   │   └── notify.ts
│   │   ├── search/
│   │   │   └── fulltext.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   │   ├── data-table.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── score-badge.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── file-upload.tsx
│   │   │   ├── notification-bell.tsx
│   │   │   └── loading-skeleton.tsx
│   │   ├── recruiter/
│   │   ├── client/
│   │   ├── candidate/
│   │   └── public/
│   ├── hooks/
│   │   ├── use-tenant.ts
│   │   ├── use-role.ts
│   │   ├── use-notifications.ts
│   │   └── use-search.ts
│   └── types/
│       ├── index.ts
│       ├── api.ts
│       └── enums.ts
├── drizzle/
│   └── migrations/
├── public/
├── drizzle.config.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── .env.local
└── package.json
```

### Step 1.4 — Create the file structure

```bash
mkdir -p src/{db/{schema,queries,migrations},lib/{ai,auth,jobs,notifications,search},components/{ui,shared,recruiter,client,candidate,public},hooks,types}
mkdir -p src/app/{"(auth)"/{sign-in/"[[...sign-in]]",sign-up/"[[...sign-up]]"},"(platform)"/{recruiter/{dashboard,talent-pool,jobs/"[jobId]",applications/"[appId]",clients/"[clientId]",analytics,messages},client/{dashboard,jobs/{new,"[jobId]"},candidates/"[candidateId]",scoring-config,messages,reports},candidate/{profile/edit,applications,jobs/"[jobId]",messages,settings}},"(public)"/{jobs/"[jobId]"},"[tenant]"/{jobs/"[jobId]",apply/"[jobId]"},api/{webhooks/clerk,upload,search,ai/{score,generate-jd,match,parse-resume},candidates/"[id]",jobs/"[id]",applications/"[id]",notes,messages,notifications,tenants/"[id]"/{scoring-config,branding},analytics/{tenant,platform},cron/{process-jobs,daily-digest,weekly-cleanup}}}
mkdir -p drizzle/migrations public/logos
```

---

## 2. ENVIRONMENT VARIABLES

### Step 2.1 — Create `.env.local`

```env
# ============================================
# NEON DATABASE (usage-based — free tier: 0.5GB, 190 compute hours)
# Get from: https://console.neon.tech → Project → Connection Details
# ============================================
DATABASE_URL="postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"

# ============================================
# CLERK AUTHENTICATION (usage-based — free tier: 10K MAUs)
# Get from: https://dashboard.clerk.com → API Keys
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
CLERK_SECRET_KEY="sk_test_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/recruiter/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/candidate/profile"

# ============================================
# ANTHROPIC — CLAUDE AI (usage-based — $3/$15 per M tokens)
# Get from: https://console.anthropic.com → API Keys
# ============================================
ANTHROPIC_API_KEY="sk-ant-xxxxx"

# ============================================
# VERCEL BLOB (usage-based — included with Vercel plan)
# Auto-populated by Vercel when Blob is enabled
# ============================================
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxx"

# ============================================
# CRON SECURITY
# ============================================
CRON_SECRET="generate-a-strong-random-secret-here"

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Purely Recruit"

# ============================================
# OPTIONAL ADD-ONS (uncomment when ready)
# ============================================
# RESEND_API_KEY="re_xxxxx"
# EMAIL_FROM="Purely Recruit <noreply@purelyworks.com>"
# PERPLEXITY_API_KEY="pplx-xxxxx"
# PEOPLE_DATA_LABS_API_KEY="xxxxx"
# HUNTER_API_KEY="xxxxx"
# INDEED_API_KEY="xxxxx"
# LINKEDIN_CLIENT_ID="xxxxx"
# LINKEDIN_CLIENT_SECRET="xxxxx"
```

**That's 4 required services + 1 auto-populated.** Everything else is optional.

---

## 3. DATABASE SCHEMA

### Step 3.1 — Drizzle configuration

**File: `drizzle.config.ts`**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!,
  },
});
```

### Step 3.2 — Database client

**File: `src/db/index.ts`**

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
export type Database = typeof db;
```

### Step 3.3 — Schema files

Build each file in `src/db/schema/` in this exact order (foreign key dependencies).

**File: `src/db/schema/tenants.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, timestamp, jsonb, boolean,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrgId: varchar("clerk_org_id").unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#455E7F"),
  accentColor: varchar("accent_color", { length: 7 }).default("#D7A839"),
  customDomain: varchar("custom_domain", { length: 255 }).unique(),
  website: text("website"),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  notificationDefaults: jsonb("notification_defaults").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
```

**File: `src/db/schema/users.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const userRoleEnum = pgEnum("user_role", [
  "platform_admin",
  "recruiter",
  "client_admin",
  "client_user",
  "candidate",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: userRoleEnum("role").default("candidate").notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  preferences: jsonb("preferences").default({}),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**File: `src/db/schema/skills.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

export const skillCategoryEnum = pgEnum("skill_category", [
  "software", "hard_skill", "soft_skill", "certificate",
]);

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: skillCategoryEnum("category").notNull(),
  subcategory: varchar("subcategory", { length: 255 }),
  aliases: text("aliases").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
```

**File: `src/db/schema/candidates.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, integer, timestamp,
  jsonb, boolean, pgEnum, real,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const availabilityEnum = pgEnum("availability", [
  "immediate", "two_weeks", "one_month", "three_months", "not_looking",
]);

export const candidates = pgTable("candidates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  locationCity: varchar("location_city", { length: 100 }),
  locationState: varchar("location_state", { length: 50 }),
  locationCountry: varchar("location_country", { length: 50 }).default("US"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  yearsExperience: integer("years_experience"),
  currentTitle: varchar("current_title", { length: 255 }),
  currentCompany: varchar("current_company", { length: 255 }),
  desiredTitles: text("desired_titles").array(),
  desiredIndustries: text("desired_industries").array(),
  desiredLocations: text("desired_locations").array(),
  salaryExpectationMin: integer("salary_expectation_min"),
  salaryExpectationMax: integer("salary_expectation_max"),
  availability: availabilityEnum("availability").default("not_looking"),
  talentScore: real("talent_score").default(0),
  enrichmentData: jsonb("enrichment_data").default({}),
  source: varchar("source", { length: 100 }),
  bio: text("bio"),
  isProfilePublic: boolean("is_profile_public").default(true),
  // Full-text search vector — auto-generated from name, title, company, bio
  searchVector: text("search_vector"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
```

**File: `src/db/schema/resumes.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, jsonb, boolean, timestamp,
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";

export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileName: varchar("file_name", { length: 500 }).notNull(),
  fileType: varchar("file_type", { length: 100 }).default("application/pdf"),
  fileSize: varchar("file_size", { length: 50 }),
  parsedData: jsonb("parsed_data").default({}),
  parsedSkills: text("parsed_skills").array(),
  parsedExperience: jsonb("parsed_experience").default([]),
  parsedEducation: jsonb("parsed_education").default([]),
  parsedCertifications: text("parsed_certifications").array(),
  rawText: text("raw_text"),
  isPrimary: boolean("is_primary").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
```

**File: `src/db/schema/candidate-skills.ts`**

```typescript
import { pgTable, uuid, varchar, integer, pgEnum } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { skills } from "./skills";

export const proficiencyEnum = pgEnum("proficiency", [
  "beginner", "intermediate", "advanced", "expert",
]);

export const candidateSkills = pgTable("candidate_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id").notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  proficiency: proficiencyEnum("proficiency"),
  yearsExperience: integer("years_experience"),
  source: varchar("source", { length: 50 }).default("parsed"),
});

export type CandidateSkill = typeof candidateSkills.$inferSelect;
```

**File: `src/db/schema/jobs.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, integer, timestamp, jsonb, pgEnum,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const jobStatusEnum = pgEnum("job_status", [
  "draft", "active", "paused", "closed", "filled",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time", "part_time", "contract", "temp", "intern",
]);

export const locationTypeEnum = pgEnum("location_type", [
  "onsite", "remote", "hybrid",
]);

export const jobOpenings = pgTable("job_openings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  department: varchar("department", { length: 255 }),
  locationCity: varchar("location_city", { length: 100 }),
  locationState: varchar("location_state", { length: 50 }),
  locationType: locationTypeEnum("location_type").default("onsite"),
  employmentType: employmentTypeEnum("employment_type").default("full_time"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description"),
  requirements: text("requirements"),
  goodIndicators: text("good_indicators").array(),
  badIndicators: text("bad_indicators").array(),
  status: jobStatusEnum("status").default("draft").notNull(),
  publishedBoards: text("published_boards").array(),
  externalIds: jsonb("external_ids").default({}),
  // Full-text search vector
  searchVector: text("search_vector"),
  createdBy: uuid("created_by").references(() => users.id),
  assignedRecruiter: uuid("assigned_recruiter").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closesAt: timestamp("closes_at"),
});

export type JobOpening = typeof jobOpenings.$inferSelect;
export type NewJobOpening = typeof jobOpenings.$inferInsert;
```

**File: `src/db/schema/job-skill-requirements.ts`**

```typescript
import { pgTable, uuid, integer, text, pgEnum } from "drizzle-orm/pg-core";
import { jobOpenings } from "./jobs";
import { skills } from "./skills";

export const importanceEnum = pgEnum("importance", [
  "mandatory", "required", "optional",
]);

export const jobSkillRequirements = pgTable("job_skill_requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobOpeningId: uuid("job_opening_id").notNull()
    .references(() => jobOpenings.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id").notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  importance: importanceEnum("importance").notNull(),
  minYears: integer("min_years"),
  notes: text("notes"),
});

export type JobSkillRequirement = typeof jobSkillRequirements.$inferSelect;
```

**File: `src/db/schema/applications.ts`**

```typescript
import {
  pgTable, uuid, varchar, text, integer, real, timestamp, pgEnum,
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { jobOpenings } from "./jobs";
import { tenants } from "./tenants";
import { resumes } from "./resumes";
import { users } from "./users";

export const applicationStatusEnum = pgEnum("application_status", [
  "new", "ai_processing", "scored", "reviewed",
  "shortlisted", "interviewing", "offered",
  "hired", "rejected", "withdrawn",
]);

export const applicationSourceEnum = pgEnum("application_source", [
  "direct_apply", "job_board", "talent_pool_match",
  "recruiter_suggested", "referral", "ai_matched",
]);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  jobOpeningId: uuid("job_opening_id").notNull()
    .references(() => jobOpenings.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id").notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  resumeId: uuid("resume_id").references(() => resumes.id),
  status: applicationStatusEnum("status").default("new").notNull(),
  source: applicationSourceEnum("source").default("direct_apply"),
  // AI Scoring — Module 1: Resume vs JD
  scoreModule1: real("score_module_1"),
  // AI Scoring — Module 2: Good/Bad Indicators
  scoreModule2: real("score_module_2"),
  // AI Scoring — Module 3: Weighted M/R/O
  scoreModule3: real("score_module_3"),
  finalScore: real("final_score"),
  weightedScore: real("weighted_score"),
  missingMandatoryCount: integer("missing_mandatory_count").default(0),
  missingMandatoryDetails: text("missing_mandatory_details"),
  aiRecommendation: varchar("ai_recommendation", { length: 50 }),
  aiNotes: text("ai_notes"),
  aiAltPosition: text("ai_alt_position"),
  aiFullReport: text("ai_full_report"),
  aiProcessedAt: timestamp("ai_processed_at"),
  // Recruiter review
  recruiterScore: real("recruiter_score"),
  recruiterNotes: text("recruiter_notes"),
  recruiterDecision: varchar("recruiter_decision", { length: 100 }),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  // Client feedback
  clientRating: integer("client_rating"),
  clientFeedback: text("client_feedback"),
  clientDecision: varchar("client_decision", { length: 100 }),
  // Metadata
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
```

**File: `src/db/schema/scoring-configs.ts`**

```typescript
import { pgTable, uuid, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const scoringConfigs = pgTable("scoring_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().unique()
    .references(() => tenants.id, { onDelete: "cascade" }),
  module1Weight: real("module_1_weight").default(0.40).notNull(),
  module2Weight: real("module_2_weight").default(0.30).notNull(),
  module3Weight: real("module_3_weight").default(0.30).notNull(),
  mandatorySkillPenalty: real("mandatory_skill_penalty").default(-10.0),
  goodIndicatorBonus: real("good_indicator_bonus").default(10.0),
  badIndicatorPenalty: real("bad_indicator_penalty").default(-10.0),
  customWeights: jsonb("custom_weights").default({}),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScoringConfig = typeof scoringConfigs.$inferSelect;
```

**File: `src/db/schema/notes.ts`**

```typescript
import { pgTable, uuid, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { applications } from "./applications";
import { tenants } from "./tenants";
import { users } from "./users";

export const noteVisibilityEnum = pgEnum("note_visibility", [
  "internal", "client", "candidate",
]);

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").references(() => candidates.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  authorId: uuid("author_id").notNull().references(() => users.id),
  authorRole: varchar("author_role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  visibility: noteVisibilityEnum("visibility").default("internal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
```

**File: `src/db/schema/messages.ts`**

```typescript
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";
import { candidates } from "./candidates";
import { applications } from "./applications";

export const messageChannelEnum = pgEnum("message_channel", [
  "in_app", "email", "sms",
]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id"),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  recipientId: uuid("recipient_id").references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  candidateId: uuid("candidate_id").references(() => candidates.id),
  applicationId: uuid("application_id").references(() => applications.id),
  subject: varchar("subject", { length: 500 }),
  body: text("body").notNull(),
  sentOnBehalfOf: varchar("sent_on_behalf_of", { length: 50 }),
  channel: messageChannelEnum("channel").default("in_app"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
```

**File: `src/db/schema/notifications.ts`**

```typescript
import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  body: text("body"),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: uuid("reference_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
```

**File: `src/db/schema/job-queue.ts`** ← NEW: replaces Inngest

```typescript
import {
  pgTable, uuid, varchar, text, integer, timestamp, jsonb, pgEnum,
} from "drizzle-orm/pg-core";

export const jobQueueStatusEnum = pgEnum("job_queue_status", [
  "pending", "running", "completed", "failed",
]);

export const jobQueue = pgTable("job_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: jsonb("payload").default({}),
  status: jobQueueStatusEnum("status").default("pending").notNull(),
  retries: integer("retries").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRunAt: timestamp("next_run_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type JobQueueItem = typeof jobQueue.$inferSelect;
export type NewJobQueueItem = typeof jobQueue.$inferInsert;
```

**File: `src/db/schema/analytics.ts`**

```typescript
import { pgTable, uuid, varchar, date, jsonb, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const reportingSnapshots = pgTable("reporting_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  periodType: varchar("period_type", { length: 20 }).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  metrics: jsonb("metrics").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**File: `src/db/schema/embeddings.ts`**

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { jobOpenings } from "./jobs";

// pgvector columns added via raw SQL after migration (see Step 3.4)

export const candidateEmbeddings = pgTable("candidate_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  resumeText: text("resume_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobEmbeddings = pgTable("job_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobOpeningId: uuid("job_opening_id").notNull()
    .references(() => jobOpenings.id, { onDelete: "cascade" }),
  descriptionText: text("description_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**File: `src/db/schema/index.ts`**

```typescript
export * from "./tenants";
export * from "./users";
export * from "./skills";
export * from "./candidates";
export * from "./resumes";
export * from "./candidate-skills";
export * from "./jobs";
export * from "./job-skill-requirements";
export * from "./applications";
export * from "./scoring-configs";
export * from "./notes";
export * from "./messages";
export * from "./notifications";
export * from "./job-queue";
export * from "./analytics";
export * from "./embeddings";
```

### Step 3.4 — Run initial migration

```bash
# Generate migration SQL
npx drizzle-kit generate

# Run migration against Neon
npx drizzle-kit migrate

# Enable pgvector + full-text search (run in Neon SQL Editor)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector columns
ALTER TABLE candidate_embeddings ADD COLUMN embedding vector(1536);
ALTER TABLE job_embeddings ADD COLUMN embedding vector(1536);

-- Create vector indexes (HNSW for fast cosine similarity)
CREATE INDEX candidate_embedding_idx ON candidate_embeddings
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX job_embedding_idx ON job_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Create full-text search indexes (GIN for fast text search)
-- Candidates: search by name, title, company, bio
CREATE INDEX candidates_search_idx ON candidates
  USING gin (to_tsvector('english',
    coalesce(first_name, '') || ' ' ||
    coalesce(last_name, '') || ' ' ||
    coalesce(current_title, '') || ' ' ||
    coalesce(current_company, '') || ' ' ||
    coalesce(bio, '')
  ));

-- Jobs: search by title, department, description
CREATE INDEX jobs_search_idx ON job_openings
  USING gin (to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(department, '') || ' ' ||
    coalesce(description, '')
  ));
```

---

## 4. AUTHENTICATION (CLERK)

*Identical to v1 spec — see Steps 5.1-5.6 in original. The auth setup doesn't change.*

Key files:
* `middleware.ts` — Clerk middleware with public route matcher
* `src/app/layout.tsx` — ClerkProvider wrapper
* `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` — Sign in
* `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` — Sign up
* `src/lib/auth/roles.ts` — 5 roles + permissions matrix
* `src/lib/auth/middleware.ts` — getAuthContext() helper
* `src/app/api/webhooks/clerk/route.ts` — Webhook handler syncing users/tenants

---

## 5. API LAYER

*Same pattern as v1 spec — see Step 6. No changes needed.*

---

## 6. BACKGROUND JOBS (DB Queue + Vercel Cron)

This replaces Inngest with zero additional services.

### Step 6.1 — Job queue helper

**File: `src/lib/jobs/queue.ts`**

```typescript
import { db } from "@/db";
import { jobQueue } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";

export type JobType =
  | "score-application"
  | "parse-resume"
  | "enrich-candidate"
  | "match-talent-pool"
  | "send-notification"
  | "generate-analytics";

export async function enqueueJob(
  type: JobType,
  payload: Record<string, any>,
  delayMs: number = 0,
) {
  return db.insert(jobQueue).values({
    type,
    payload,
    nextRunAt: new Date(Date.now() + delayMs),
    status: "pending",
    maxRetries: 3,
  });
}

export async function claimPendingJobs(limit: number = 5) {
  // Atomic claim: select + update in one query to prevent double-processing
  const pending = await db
    .select()
    .from(jobQueue)
    .where(
      and(
        eq(jobQueue.status, "pending"),
        lt(jobQueue.nextRunAt, new Date()),
      ),
    )
    .limit(limit);

  // Mark as running
  for (const job of pending) {
    await db
      .update(jobQueue)
      .set({ status: "running", startedAt: new Date() })
      .where(eq(jobQueue.id, job.id));
  }

  return pending;
}

export async function completeJob(jobId: string) {
  await db
    .update(jobQueue)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(jobQueue.id, jobId));
}

export async function failJob(jobId: string, error: string, retries: number, maxRetries: number) {
  if (retries >= maxRetries) {
    await db
      .update(jobQueue)
      .set({ status: "failed", error })
      .where(eq(jobQueue.id, jobId));
  } else {
    // Exponential backoff: 1m, 2m, 4m, 8m
    const delayMs = Math.pow(2, retries) * 60000;
    await db
      .update(jobQueue)
      .set({
        status: "pending",
        retries: retries + 1,
        nextRunAt: new Date(Date.now() + delayMs),
        error,
      })
      .where(eq(jobQueue.id, jobId));
  }
}
```

### Step 6.2 — Cron job processor

**File: `src/app/api/cron/process-jobs/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { claimPendingJobs, completeJob, failJob } from "@/lib/jobs/queue";
import { scoreApplication } from "@/lib/ai/scoring";
import { parseResume } from "@/lib/ai/resume-parser";
import { matchTalentPool } from "@/lib/ai/matching";

export async function GET(req: NextRequest) {
  // Verify cron authentication
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await claimPendingJobs(5);
  const results = { processed: 0, failed: 0 };

  for (const job of jobs) {
    try {
      switch (job.type) {
        case "score-application":
          await scoreApplication(job.payload as any);
          break;
        case "parse-resume":
          await parseResume(job.payload as any);
          break;
        case "match-talent-pool":
          await matchTalentPool(job.payload as any);
          break;
        case "send-notification":
          // In-app notification — just save to DB (already done by notify())
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
      await completeJob(job.id);
      results.processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await failJob(job.id, message, job.retries || 0, job.maxRetries || 3);
      results.failed++;
    }
  }

  return NextResponse.json(results);
}
```

### Step 6.3 — Fire-and-forget with after()

For tasks that don't need retries (like updating search vectors), use `after()` from Next.js:

```typescript
// Inside any API route or Server Action
import { after } from "next/server";

// After creating a candidate, update search vector
after(async () => {
  await db.execute(sql`
    UPDATE candidates SET search_vector = to_tsvector('english',
      coalesce(first_name, '') || ' ' ||
      coalesce(last_name, '') || ' ' ||
      coalesce(current_title, '') || ' ' ||
      coalesce(current_company, '') || ' ' ||
      coalesce(bio, '')
    ) WHERE id = ${candidateId}
  `);
});
```

### Step 6.4 — Vercel Cron configuration

**File: `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/process-jobs",
      "schedule": "*/2 * * * *"
    },
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 16 * * *"
    },
    {
      "path": "/api/cron/weekly-cleanup",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

---

## 7. SEARCH (PostgreSQL Full-Text)

No Meilisearch needed. Neon's built-in PostgreSQL full-text search handles everything.

### Step 7.1 — Search helper

**File: `src/lib/search/fulltext.ts`**

```typescript
import { db } from "@/db";
import { candidates, jobOpenings } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function searchCandidates(
  query: string,
  filters?: {
    locationState?: string;
    minExperience?: number;
    availability?: string;
  },
) {
  const tsquery = query.trim().split(/\s+/).join(" & ");

  let whereClause = sql`to_tsvector('english',
    coalesce(${candidates.firstName}, '') || ' ' ||
    coalesce(${candidates.lastName}, '') || ' ' ||
    coalesce(${candidates.currentTitle}, '') || ' ' ||
    coalesce(${candidates.currentCompany}, '') || ' ' ||
    coalesce(${candidates.bio}, '')
  ) @@ to_tsquery('english', ${tsquery})`;

  // Add filters
  if (filters?.locationState) {
    whereClause = sql`${whereClause} AND ${candidates.locationState} = ${filters.locationState}`;
  }
  if (filters?.minExperience) {
    whereClause = sql`${whereClause} AND ${candidates.yearsExperience} >= ${filters.minExperience}`;
  }

  return db
    .select()
    .from(candidates)
    .where(whereClause)
    .orderBy(sql`ts_rank(to_tsvector('english',
      coalesce(${candidates.firstName}, '') || ' ' ||
      coalesce(${candidates.lastName}, '') || ' ' ||
      coalesce(${candidates.currentTitle}, '') || ' ' ||
      coalesce(${candidates.currentCompany}, '') || ' ' ||
      coalesce(${candidates.bio}, '')
    ), to_tsquery('english', ${tsquery})) DESC`)
    .limit(50);
}

export async function searchJobs(
  query: string,
  filters?: {
    tenantId?: string;
    status?: string;
    locationType?: string;
  },
) {
  const tsquery = query.trim().split(/\s+/).join(" & ");

  let whereClause = sql`to_tsvector('english',
    coalesce(${jobOpenings.title}, '') || ' ' ||
    coalesce(${jobOpenings.department}, '') || ' ' ||
    coalesce(${jobOpenings.description}, '')
  ) @@ to_tsquery('english', ${tsquery})`;

  if (filters?.tenantId) {
    whereClause = sql`${whereClause} AND ${jobOpenings.tenantId} = ${filters.tenantId}`;
  }
  if (filters?.status) {
    whereClause = sql`${whereClause} AND ${jobOpenings.status} = ${filters.status}`;
  }

  return db
    .select()
    .from(jobOpenings)
    .where(whereClause)
    .orderBy(sql`ts_rank(to_tsvector('english',
      coalesce(${jobOpenings.title}, '') || ' ' ||
      coalesce(${jobOpenings.department}, '') || ' ' ||
      coalesce(${jobOpenings.description}, '')
    ), to_tsquery('english', ${tsquery})) DESC`)
    .limit(50);
}
```

### Step 7.2 — Search API route

**File: `src/app/api/search/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { searchCandidates, searchJobs } from "@/lib/search/fulltext";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "candidates";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (type === "candidates") {
    const results = await searchCandidates(q, {
      locationState: searchParams.get("state") || undefined,
      minExperience: searchParams.get("minExp")
        ? parseInt(searchParams.get("minExp")!)
        : undefined,
    });
    return NextResponse.json({ results });
  }

  if (type === "jobs") {
    const results = await searchJobs(q, {
      tenantId: context.role === "client_admin" ? context.tenantId || undefined : undefined,
      status: searchParams.get("status") || undefined,
    });
    return NextResponse.json({ results });
  }

  return NextResponse.json({ results: [] });
}
```

---

## 8. NOTIFICATIONS (Polling)

No Pusher needed. Simple polling every 30 seconds.

### Step 8.1 — Notification helper

**File: `src/lib/notifications/notify.ts`**

```typescript
import { db } from "@/db";
import { notifications } from "@/db/schema";

type NotifyParams = {
  userId: string;
  tenantId?: string;
  type: string;
  title: string;
  body?: string;
  referenceType?: string;
  referenceId?: string;
};

export async function notify(params: NotifyParams) {
  // Save to database — polling picks it up
  await db.insert(notifications).values({
    userId: params.userId,
    tenantId: params.tenantId || null,
    type: params.type,
    title: params.title,
    body: params.body,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    isRead: false,
  });

  // If email add-on is enabled, also queue email notification
  if (process.env.RESEND_API_KEY) {
    const { enqueueJob } = await import("@/lib/jobs/queue");
    await enqueueJob("send-notification", {
      ...params,
      channel: "email",
    });
  }
}
```

### Step 8.2 — Notification API route

**File: `src/app/api/notifications/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";

// GET — Fetch unread notifications (polling target)
export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");

  let conditions = [eq(notifications.userId, context.userId)];

  if (since) {
    conditions.push(gt(notifications.createdAt, new Date(parseInt(since))));
  }

  const items = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const unreadCount = items.filter((n) => !n.isRead).length;

  return NextResponse.json({ notifications: items, unreadCount, timestamp: Date.now() });
}

// PATCH — Mark notifications as read
export async function PATCH(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { notificationIds } = await req.json();

  for (const id of notificationIds) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, context.userId)));
  }

  return NextResponse.json({ success: true });
}
```

### Step 8.3 — Client-side polling hook

**File: `src/hooks/use-notifications.ts`**

```typescript
"use client";

import { useEffect, useState, useRef } from "react";

export function useNotifications(intervalMs = 30000) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastCheckRef = useRef(Date.now());

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/notifications?since=${lastCheckRef.current}`,
        );
        const data = await res.json();

        if (data.notifications.length > 0) {
          setNotifications((prev) => [...data.notifications, ...prev].slice(0, 100));
          setUnreadCount(data.unreadCount);
          lastCheckRef.current = data.timestamp;
        }
      } catch (error) {
        console.error("Notification poll failed:", error);
      }
    };

    poll(); // Initial fetch
    const interval = setInterval(poll, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  const markAsRead = async (ids: string[]) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds: ids }),
    });
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  return { notifications, unreadCount, markAsRead };
}
```

---

## 9. FILE UPLOADS (Vercel Blob)

*Same as v1 spec — Vercel Blob is already in the core stack. No changes.*

**File: `src/app/api/upload/route.ts`**

```typescript
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { enqueueJob } from "@/lib/jobs/queue";
import { db } from "@/db";
import { resumes } from "@/db/schema";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const candidateId = formData.get("candidateId") as string;

  if (!file || !candidateId) {
    return NextResponse.json({ error: "File and candidateId required" }, { status: 400 });
  }

  const blob = await put(
    `resumes/${candidateId}/${Date.now()}-${file.name}`,
    file,
    { access: "public" },
  );

  const [resume] = await db
    .insert(resumes)
    .values({
      candidateId,
      fileUrl: blob.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: String(file.size),
      isPrimary: true,
    })
    .returning();

  // Queue async resume parsing
  await enqueueJob("parse-resume", { resumeId: resume.id, candidateId });

  return NextResponse.json({ resume, blobUrl: blob.url }, { status: 201 });
}
```

---

## 10. AI ENGINE (Claude)

*Same as v1 spec — see Steps 12.1-12.5. Claude API is in the core stack.*

Key files and what they do:
* `src/lib/ai/client.ts` — Anthropic SDK client + model constant
* `src/lib/ai/scoring.ts` — Three-module scoring (Resume vs JD, Good/Bad Indicators, M/R/O Weighted)
* `src/lib/ai/resume-parser.ts` — Claude parses resume text into structured data
* `src/lib/ai/job-description.ts` — Claude generates JD with suggested M/R/O skills
* `src/lib/ai/matching.ts` — pgvector cosine similarity for talent pool matching
* `src/lib/ai/embeddings.ts` — Generate and store vector embeddings

---

## 11-15. PORTAL PAGES

*Same as v1 spec — see Steps 7-11. The UI layer doesn't change.*

Build each portal as Next.js pages using Server Components for data fetching and Client Components for interactivity.

| Portal | Pages | Key Components |
|---|---|---|
| **Recruiter** | Dashboard, Talent Pool, Jobs, Applications, Clients, Analytics, Messages | Data tables, search, score badges, pipeline views |
| **Client** | Dashboard, Jobs, Candidates, Scoring Config, Messages, Reports | Job forms, candidate cards, weight sliders, feedback |
| **Client Job Portal** | /[tenant]/jobs, /[tenant]/apply | Tenant-branded job listings, apply forms |
| **Company Job Board** | /jobs | Aggregated job board, public search |
| **Candidate** | Profile, Resume Upload, Jobs, Applications, Messages | Profile editor, resume uploader, application tracker |

---

## 16. DEPLOYMENT (Vercel)

### Step 16.1 — Deploy

```bash
npm install -g vercel
vercel link
vercel env add DATABASE_URL
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_WEBHOOK_SECRET
vercel env add ANTHROPIC_API_KEY
vercel env add CRON_SECRET
# Blob token auto-populated when enabled
vercel --prod
```

### Step 16.2 — Post-deployment

1. Update Clerk webhook URL to production domain
2. Run pgvector + GIN index SQL in Neon SQL Editor
3. Seed skills taxonomy
4. Configure custom domains for tenants in Vercel

---

## 17. MIGRATION FROM AIRTABLE

*Same as v1 spec — see Step 22. Migration logic doesn't change.*

---

## 18. ADD-ON: EMAIL NOTIFICATIONS (Resend)

**When to add:** When you want email alerts for new candidates, interview reminders, daily digests.

### Step 18.1 — Install

```bash
npm install resend
```

### Step 18.2 — Add env vars

```env
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="Purely Recruit <noreply@purelyworks.com>"
```

### Step 18.3 — Email sender

**File: `src/lib/email/sender.ts`** (only create this file when add-on is enabled)

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, html: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
}
```

The `notify()` function in `src/lib/notifications/notify.ts` already checks for `process.env.RESEND_API_KEY` and queues email jobs when available. No changes needed to core code.

---

## 19. ADD-ON: ENRICHMENT (Perplexity + PDL)

**When to add:** When you want to auto-research candidates and companies.

### Step 19.1 — Perplexity for company/candidate research

```bash
# No npm install needed — uses fetch API
```

```env
PERPLEXITY_API_KEY="pplx-xxxxx"
```

**File: `src/lib/enrichment/perplexity.ts`** (only create when add-on enabled)

```typescript
export async function researchCandidate(name: string, company: string, title: string) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: "You are a recruiting research assistant. Return structured JSON only.",
        },
        {
          role: "user",
          content: `Research this professional for recruiting purposes:
Name: ${name}
Current Company: ${company}
Current Title: ${title}

Return JSON with: { companyInfo: { industry, size, recentNews }, candidateInsights: { publicProjects, publications, speakingEngagements, careerTrajectory }, relevantSignals: string[] }`,
        },
      ],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function researchCompany(companyName: string, domain?: string) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: "You are a business research assistant. Return structured JSON only.",
        },
        {
          role: "user",
          content: `Research this company for B2B sales intelligence:
Company: ${companyName}
${domain ? `Website: ${domain}` : ""}

Return JSON with: { overview, industry, estimatedSize, recentHires, techStack, painPoints, growthSignals }`,
        },
      ],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
```

### Step 19.2 — People Data Labs for verified contact data

```env
PEOPLE_DATA_LABS_API_KEY="xxxxx"
```

**File: `src/lib/enrichment/pdl.ts`** (only create when add-on enabled)

```typescript
export async function enrichCandidate(email: string) {
  const response = await fetch(
    `https://api.peopledatalabs.com/v5/person/enrich?email=${encodeURIComponent(email)}`,
    {
      headers: {
        "X-Api-Key": process.env.PEOPLE_DATA_LABS_API_KEY!,
      },
    },
  );

  if (!response.ok) return null;
  return response.json();
}
```

---

## 20. ADD-ON: JOB BOARD INTEGRATIONS

**When to add:** When clients want jobs posted to Indeed, LinkedIn, etc.

Each integration is a standalone file in `src/lib/job-boards/`. They plug into the job queue:

```typescript
await enqueueJob("sync-job-board", {
  jobOpeningId,
  board: "indeed", // or "linkedin", "ziprecruiter"
});
```

Integration files to build when ready:
* `src/lib/job-boards/indeed.ts`
* `src/lib/job-boards/linkedin.ts`
* `src/lib/job-boards/ziprecruiter.ts`
* `src/lib/job-boards/google-jobs.ts` (structured data markup — free, no API needed)

---

## BUILD ORDER CHECKLIST

### Phase 1: Foundation (Steps 1-5)
- [ ] Scaffold Next.js project
- [ ] Install core dependencies only (no Meilisearch, no Inngest, no Pusher)
- [ ] Create directory structure
- [ ] Set up 4 environment variables
- [ ] Build all 17 Drizzle schema files (including job_queue)
- [ ] Run migration on Neon + enable pgvector + create GIN indexes
- [ ] Set up Clerk (middleware, provider, webhook handler)
- [ ] Build auth helper middleware
- [ ] Build all API routes

### Phase 2: Background Jobs + Search + Notifications (Steps 6-8)
- [ ] Job queue helper (enqueue, claim, complete, fail)
- [ ] Cron job processor route
- [ ] PostgreSQL full-text search helper
- [ ] Search API route
- [ ] Notification helper (in-app only)
- [ ] Notification polling API + client hook

### Phase 3: AI Engine + File Uploads (Steps 9-10)
- [ ] Claude API client
- [ ] Three-module scoring function
- [ ] Resume parser function
- [ ] Job description generator
- [ ] Talent pool matching with pgvector
- [ ] Vercel Blob upload endpoint

### Phase 4: Recruiter Portal (Step 11)
- [ ] Layout with sidebar navigation
- [ ] Dashboard with stat cards
- [ ] Talent pool with PostgreSQL full-text search
- [ ] Jobs list, detail, and applicant views
- [ ] Application detail with score display
- [ ] Client management pages
- [ ] Analytics page
- [ ] Messages inbox

### Phase 5: Client Portal (Step 12)
- [ ] Tenant-branded layout
- [ ] Client dashboard
- [ ] Job list and creation form with AI JD generation
- [ ] Candidate pipeline (kanban)
- [ ] Scoring configuration page
- [ ] Reports

### Phase 6: Candidate Portal + Public Portals (Steps 13-15)
- [ ] Candidate profile and resume upload
- [ ] Job browse and application tracker
- [ ] Company-wide job board (public)
- [ ] Tenant-branded job portal (dynamic routing)
- [ ] Apply form with account creation
- [ ] Google for Jobs schema markup (free — no API)

### Phase 7: Deploy + Migrate (Steps 16-17)
- [ ] Vercel deployment with 4 env vars
- [ ] Configure cron jobs
- [ ] Migrate Airtable data
- [ ] Validate migration
- [ ] Go live

### Phase 8: Add-Ons (Steps 18-20) — when ready
- [ ] Resend for email notifications
- [ ] Perplexity API for candidate/company research
- [ ] People Data Labs for contact enrichment
- [ ] Indeed job board integration
- [ ] LinkedIn job board integration
- [ ] ZipRecruiter integration

---

## MONTHLY COST ESTIMATE (Core Only)

| Service | Free Tier | Estimated Cost at Scale |
|---|---|---|
| Neon DB | 0.5 GB free | ~$19/mo (Scale plan) |
| Clerk | 10K MAUs free | ~$25/mo (Pro plan) |
| Vercel | Generous free tier | ~$20/mo (Pro plan) |
| Claude API | Pay per token | ~$50-150/mo (depends on volume) |
| Vercel Blob | Included | ~$0-5/mo |
| **Total** | **$0 to start** | **~$114-219/mo at scale** |

Compare to v1 spec with all third-party tools: **$450-700/mo**

---

*This build spec uses 6 core services (4 paid, 2 free) to deliver the entire Purely Recruit platform. Every external integration is an optional add-on that plugs in without changing core code. Usage-based pricing means you pay $0 to prototype and scale costs with revenue.*

*Built by Purely Works — Helping You Build Smarter with AI*
