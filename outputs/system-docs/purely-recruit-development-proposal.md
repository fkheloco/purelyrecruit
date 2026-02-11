# Purely Recruit — Full-Stack AI Recruiting Platform

## Development Proposal & System Architecture

> **Prepared by:** Farid Kheloco, CEO / Co-Founder — Purely Works
> **Date:** February 2026
> **Status:** Internal Planning Document
> **Version:** 1.0

---

## Executive Summary

This proposal outlines the design and development roadmap for **Purely Recruit** — a multi-tenant, AI-powered recruiting platform that evolves our current Airtable-based ATS into a full-stack SaaS product. The platform serves three distinct user types (Recruiters, Clients, Candidates) with complete data isolation, AI-driven scoring, job board distribution, and talent pool intelligence.

**What we're building:**

* A recruiter command center for managing talent across all clients
* Client-branded portals where hiring managers review candidates and provide feedback
* A candidate-facing job board and talent pool where applicants build profiles, browse jobs, and apply
* An AI engine that scores candidates, generates job descriptions, matches talent to jobs, and enriches profiles
* Integration with major job boards (Indeed, LinkedIn, ZipRecruiter) and enrichment APIs (Apollo, People Data Labs)

**Why now:**

Our Airtable system has validated the AI scoring model with live clients (CM Solutions, BrioSolutions). The three-module scoring approach works. The M/R/O skill framework works. What we need is a platform that scales — multi-client, multi-recruiter, self-service for candidates, and seamless for clients.

---

## Part 1: The Entity Model

### Core Entities

```
┌─────────────────────────────────────────────────────┐
│                    PURELY WORKS                      │
│              (Platform Operator)                     │
│                                                      │
│  ┌──────────┐  manages   ┌──────────────────┐       │
│  │ Recruiter │──────────▶│     Client       │       │
│  │  (User)   │           │   (Tenant)       │       │
│  └──────────┘           └──────────────────┘       │
│       │                        │                     │
│       │ scores/manages         │ has                 │
│       ▼                        ▼                     │
│  ┌──────────┐           ┌──────────────────┐       │
│  │Application│◀─────────│  Job Opening     │       │
│  │ (Score)   │  applied  │                  │       │
│  └──────────┘  to       └──────────────────┘       │
│       │                        │                     │
│       │ belongs to             │ requires            │
│       ▼                        ▼                     │
│  ┌──────────┐           ┌──────────────────┐       │
│  │ Candidate │           │  Skills/Certs    │       │
│  │ (Talent)  │           │  (Taxonomy)      │       │
│  └──────────┘           └──────────────────┘       │
│       │                                              │
│       │ has many                                     │
│       ▼                                              │
│  ┌──────────┐                                       │
│  │  Resume   │                                       │
│  └──────────┘                                       │
└─────────────────────────────────────────────────────┘
```

### Entity Definitions

| Entity | Description | Key Relationships |
|---|---|---|
| **Organization** | Purely Works — the platform operator | Has many Recruiters, manages many Clients |
| **Recruiter** | Purely Works team member | Manages Clients, scores Applications, views full Talent Pool |
| **Client** (Tenant) | External company using our recruiting services | Has many Job Openings, has many Client Users, sees only their Candidates |
| **Client User** | Hiring manager or other client stakeholder | Views their Client's candidates, leaves feedback/notes, configures scoring weights |
| **Job Opening** | A position a Client needs filled | Has M/R/O skill requirements, has many Applications, belongs to one Client |
| **Candidate** | A person in the talent pool | Has a profile, many Resumes, many Applications across many Job Openings and Clients |
| **Application** | A Candidate applied to a specific Job Opening | Has AI scores (3 modules), recruiter scores, client feedback, notes, decision status |
| **Resume** | A document uploaded by a Candidate | Parsed into structured data, one Candidate can have many Resumes |
| **Skill** | A competency from the taxonomy | Categorized as Software, Hard Skill, Soft Skill, or Certificate |
| **Note** | A comment on a Candidate or Application | Can be from Recruiter, Client User, or AI — scoped to candidate-level or application-level |
| **Notification** | An alert sent to any user type | Configurable per job, per user, per channel |

### Critical Design Decisions

**Candidate vs. Application — The Two-Level Model**

This is the most important architectural decision. A Candidate is a person. An Application is that person's submission to a specific job. This separation enables:

* **Talent pool scoring** — How good is this candidate in general? (skills, experience, certifications, enriched profile data)
* **Application scoring** — How well does this candidate match this specific job? (the three-module AI scoring we already have)
* **Cross-client visibility** — Recruiters see a candidate's full history across all clients. Clients only see applications to their jobs.
* **One-to-many resumes** — A candidate can upload multiple resumes (e.g., different formats for different roles). Each application links to a specific resume version.
* **Notes isolation** — Recruiter notes on a candidate are internal. Client notes on an application are shared with the recruiter but not with other clients.

---

## Part 2: Database Schema

### PostgreSQL with Row-Level Security (Multi-Tenant)

Every table that contains client-specific data includes a `tenant_id` column. PostgreSQL Row-Level Security (RLS) policies ensure that a Client User query **only ever returns rows belonging to their tenant**, enforced at the database level — not just application logic.

### Core Tables

```sql
-- TENANTS (Clients)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- for URL: recruit.purelyworks.com/acme
    logo_url TEXT,
    primary_color TEXT DEFAULT '#455E7F',
    accent_color TEXT DEFAULT '#D7A839',
    custom_domain TEXT UNIQUE, -- acme.recruit.purelyworks.com
    scoring_weights JSONB DEFAULT '{}', -- client-specific scoring config
    notification_defaults JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS (all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN (
        'platform_admin', 'recruiter',
        'client_admin', 'client_user',
        'candidate'
    )),
    tenant_id UUID REFERENCES tenants(id), -- NULL for platform roles
    avatar_url TEXT,
    phone TEXT,
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CANDIDATES (talent pool - global, not tenant-scoped)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id), -- link to login account
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location_city TEXT,
    location_state TEXT,
    location_country TEXT DEFAULT 'US',
    linkedin_url TEXT,
    portfolio_url TEXT,
    years_experience INTEGER,
    current_title TEXT,
    current_company TEXT,
    desired_titles TEXT[], -- what they're open to
    desired_industries TEXT[], -- industries they're interested in
    desired_locations TEXT[], -- where they'd work
    salary_expectation_min INTEGER,
    salary_expectation_max INTEGER,
    availability TEXT, -- immediate, 2 weeks, 1 month, etc.
    talent_score INTEGER DEFAULT 0, -- general quality score (0-100)
    enrichment_status TEXT DEFAULT 'pending',
    enriched_at TIMESTAMPTZ,
    enrichment_data JSONB DEFAULT '{}', -- Apollo/PDL data
    source TEXT, -- indeed, linkedin, referral, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESUMES (one candidate, many resumes)
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT DEFAULT 'application/pdf',
    parsed_data JSONB DEFAULT '{}', -- AI-parsed structured data
    parsed_skills TEXT[], -- extracted skills list
    parsed_experience JSONB DEFAULT '[]', -- work history
    parsed_education JSONB DEFAULT '[]',
    parsed_certifications TEXT[],
    is_primary BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- CANDIDATE SKILLS (structured skill associations)
CREATE TABLE candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    skill_id UUID NOT NULL REFERENCES skills(id),
    proficiency TEXT CHECK (proficiency IN ('beginner','intermediate','advanced','expert')),
    years_experience INTEGER,
    source TEXT DEFAULT 'parsed', -- parsed, self-reported, enriched
    UNIQUE(candidate_id, skill_id)
);

-- SKILLS TAXONOMY
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'software', 'hard_skill', 'soft_skill', 'certificate'
    )),
    subcategory TEXT, -- e.g., 'Project Management Software'
    aliases TEXT[], -- alternative names for matching
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB OPENINGS (tenant-scoped)
CREATE TABLE job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title TEXT NOT NULL,
    department TEXT,
    location_city TEXT,
    location_state TEXT,
    location_type TEXT CHECK (location_type IN ('onsite','remote','hybrid')),
    employment_type TEXT CHECK (employment_type IN (
        'full_time','part_time','contract','temp','intern'
    )),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT, -- full job description (can be AI-generated)
    requirements TEXT, -- requirements narrative
    good_indicators TEXT[], -- positive signals to look for
    bad_indicators TEXT[], -- negative signals to flag
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft','active','paused','closed','filled'
    )),
    published_boards TEXT[], -- which job boards it's posted to
    external_ids JSONB DEFAULT '{}', -- indeed_id, linkedin_id, etc.
    notification_config JSONB DEFAULT '{}', -- per-job notification rules
    created_by UUID REFERENCES users(id),
    assigned_recruiter UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closes_at TIMESTAMPTZ
);

-- JOB SKILL REQUIREMENTS (M/R/O framework)
CREATE TABLE job_skill_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id),
    skill_id UUID NOT NULL REFERENCES skills(id),
    importance TEXT NOT NULL CHECK (importance IN (
        'mandatory', 'required', 'optional'
    )),
    min_years INTEGER, -- minimum years of experience with this skill
    notes TEXT, -- why this skill matters for this role
    UNIQUE(job_opening_id, skill_id)
);

-- APPLICATIONS (junction: candidate + job opening + scoring)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id), -- for RLS
    resume_id UUID REFERENCES resumes(id), -- which resume was used
    status TEXT DEFAULT 'new' CHECK (status IN (
        'new','ai_processing','scored','reviewed',
        'shortlisted','interviewing','offered',
        'hired','rejected','withdrawn'
    )),
    -- AI Scoring (3 modules from current system)
    score_module_1 NUMERIC(5,2), -- Resume vs. JD (%)
    score_module_2 NUMERIC(5,2), -- Good/Bad indicators (%)
    score_module_3 NUMERIC(5,2), -- Weighted M/R/O (%)
    final_score NUMERIC(5,2), -- Combined score (0-100)
    weighted_score NUMERIC(5,2),
    missing_mandatory_count INTEGER DEFAULT 0,
    missing_mandatory_details TEXT,
    ai_recommendation TEXT, -- Recommended / Not Recommended
    ai_notes TEXT, -- AI-generated analysis
    ai_alt_position TEXT, -- suggested alternative role
    ai_processed_at TIMESTAMPTZ,
    -- Recruiter scoring
    recruiter_score NUMERIC(5,2),
    recruiter_notes TEXT,
    recruiter_decision TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    -- Client feedback
    client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
    client_feedback TEXT,
    client_decision TEXT,
    -- Metadata
    source TEXT, -- job_board, talent_pool_match, direct_apply, recruiter_suggested
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, job_opening_id)
);

-- NOTES (on candidates or applications, multi-level)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id),
    application_id UUID REFERENCES applications(id),
    tenant_id UUID REFERENCES tenants(id), -- for RLS on client notes
    author_id UUID NOT NULL REFERENCES users(id),
    author_role TEXT NOT NULL, -- recruiter, client_user, ai
    content TEXT NOT NULL,
    visibility TEXT DEFAULT 'internal' CHECK (visibility IN (
        'internal', -- only Purely Works team sees
        'client', -- client + Purely Works sees
        'candidate' -- candidate sees (rare, for feedback)
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES (in-platform communication)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID, -- for conversation threading
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID REFERENCES users(id), -- NULL for group messages
    tenant_id UUID REFERENCES tenants(id),
    candidate_id UUID REFERENCES candidates(id), -- context
    application_id UUID REFERENCES applications(id), -- context
    subject TEXT,
    body TEXT NOT NULL,
    sent_on_behalf_of TEXT, -- 'purely_works' or 'client'
    channel TEXT DEFAULT 'in_app' CHECK (channel IN (
        'in_app', 'email', 'sms'
    )),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tenant_id UUID REFERENCES tenants(id),
    type TEXT NOT NULL, -- new_application, status_change, daily_digest, etc.
    title TEXT NOT NULL,
    body TEXT,
    reference_type TEXT, -- application, job_opening, candidate, message
    reference_id UUID,
    channel TEXT NOT NULL, -- email, in_app, sms, push
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'sent', 'delivered', 'read', 'failed'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- CLIENT SCORING CONFIGURATION (per-tenant scoring weights)
CREATE TABLE scoring_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    module_1_weight NUMERIC(3,2) DEFAULT 0.40, -- Resume vs JD weight
    module_2_weight NUMERIC(3,2) DEFAULT 0.30, -- Good/Bad indicators weight
    module_3_weight NUMERIC(3,2) DEFAULT 0.30, -- Weighted M/R/O weight
    mandatory_skill_penalty NUMERIC(5,2) DEFAULT -10.0, -- per missing mandatory
    good_indicator_bonus NUMERIC(5,2) DEFAULT 10.0,
    bad_indicator_penalty NUMERIC(5,2) DEFAULT -10.0,
    custom_weights JSONB DEFAULT '{}', -- additional client-specific weights
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- JOB BOARD POSTINGS (tracking external distribution)
CREATE TABLE job_board_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id),
    board_name TEXT NOT NULL, -- indeed, linkedin, ziprecruiter, etc.
    external_job_id TEXT, -- the ID on the external platform
    posting_url TEXT, -- link to the live posting
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'posted', 'active', 'expired', 'removed', 'error'
    )),
    posted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    applicant_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    spend NUMERIC(10,2) DEFAULT 0, -- cost of sponsored posting
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYTICS / REPORTING (materialized for performance)
CREATE TABLE reporting_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id), -- NULL for platform-wide
    period_type TEXT NOT NULL, -- daily, weekly, monthly
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metrics JSONB NOT NULL, -- flexible metrics storage
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row-Level Security Policies

```sql
-- Applications: clients only see their tenant's applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_tenant_isolation ON applications
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Job Openings: clients only see their tenant's jobs
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_tenant_isolation ON job_openings
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Notes: visibility rules apply
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY note_isolation ON notes
    USING (
        tenant_id IS NULL -- internal notes visible to recruiters
        OR tenant_id = current_setting('app.current_tenant')::uuid
    );
```

---

## Part 3: User Interfaces & Portals

### Portal 1: Recruiter Dashboard (Purely Works Internal)

**Who uses it:** Purely Works recruiters (Farid, Armeen, and team)

**What they see:**

* **Full Talent Pool** — Every candidate across all clients, with talent scores, enrichment status, skills
* **All Job Openings** — Across all clients, filterable by client, status, location, skills
* **All Applications** — Sortable by score, status, client, date
* **Client Management** — Switch between clients, view client-specific pipelines
* **Analytics** — Company-wide metrics (total candidates, placements, time-to-fill, by industry/role/geography)
* **Messaging** — Send messages on behalf of Purely Works or on behalf of a specific client
* **AI Tools** — Trigger AI scoring, generate job descriptions, find matching talent, enrich profiles

**Key Recruiter Workflows:**

1. **Client creates a job** → Recruiter gets notified → Reviews JD → AI auto-suggests matching candidates from talent pool → Recruiter adds selected candidates to the job → AI scores them → Recruiter reviews and shortlists
2. **Candidate applies via job board** → Application created → AI scores automatically → Recruiter reviews → Adds notes → Shares shortlist with client
3. **Talent pool mining** → Recruiter searches talent pool by skills/location/experience → Finds candidates who match an open job → Adds them to the job → Application created with source = "recruiter_suggested"

### Portal 2: Client Portal (Branded Per-Client)

**Who uses it:** Hiring managers and stakeholders at each client company

**What they see (ONLY their tenant's data):**

* **Their Job Openings** — Active, paused, closed
* **Their Candidates** — Only applicants who applied to their jobs (NOT the full talent pool)
* **Application Pipeline** — Kanban or list view of candidates per job, with AI scores, recruiter notes, and ability to leave feedback
* **Scoring Configuration** — Adjust weights for the three scoring modules, set good/bad indicators, define M/R/O requirements
* **Messages** — Communicate with Purely Works recruiters about specific candidates
* **Reports** — Metrics for their account: time-to-fill, candidates per job, score distributions

**Client-Branded Experience:**

* Logo, colors, and custom domain loaded from tenant config
* All emails sent from their branded sender (or co-branded with Purely Works)
* Job portal page uses their branding
* No mention of other clients anywhere in their view

### Portal 3: Client Job Portal (Public-Facing, Branded)

**Who uses it:** External candidates browsing and applying for a specific client's jobs

**URL:** `{client-slug}.jobs.purelyworks.com` or client's custom domain

**What they see:**

* **Client-branded job listings** — Logo, colors, company description
* **Job detail pages** — Full description, requirements, location, salary range
* **Apply button** — Creates account (or uses existing talent pool profile) → Uploads resume → Fills application questions → Submits
* **Status tracking** — Candidate can check application status after applying

### Portal 4: Purely Works Job Board (Company-Wide)

**Who uses it:** Candidates looking across all of Purely Works' clients

**URL:** `jobs.purelyworks.com`

**What they see:**

* **All active job openings** across all clients (client names shown or anonymized based on client preference)
* **Search and filter** — By role, industry, location, salary, employment type
* **Apply** — Same flow as client portal, but candidate sees the full range of opportunities
* **Talent pool profile** — Build and manage their profile, get matched to future jobs

### Portal 5: Candidate Talent Pool (Self-Service Profile)

**Who uses it:** Candidates who want to be found by recruiters

**What they can do:**

* **Build profile** — Upload resumes, add skills, certifications, desired roles, industries, locations
* **Browse jobs** — See all open positions (company-wide job board)
* **Apply** — Use their profile to apply with one click
* **Track applications** — See status of all their applications across all jobs
* **Preferences** — Set notification preferences, availability, salary expectations
* **Upload multiple resumes** — Different versions for different role types
* **Update availability** — Actively looking, open to opportunities, not looking

---

## Part 4: AI Capabilities

### 4.1 AI-Powered Job Description Generation

**When a client creates a new job opening:**

1. Client enters basic info: title, department, location, a few sentences about the role
2. AI generates a full job description including:
   * Role summary
   * Key responsibilities
   * Required qualifications
   * Preferred qualifications
   * Salary range suggestion (based on market data)
3. AI auto-populates skill requirements in M/R/O format:
   * Pulls from skills taxonomy
   * Suggests Software (M/R/O), Hard Skills (M/R/O), Soft Skills (M/R/O), Certificates (M/R/O)
   * Client reviews and adjusts
4. AI suggests Good Indicators and Bad Indicators based on the role and industry

**Tech:** Claude API + Lightcast Skills Taxonomy for standardized skill suggestions

### 4.2 Three-Module Scoring (Evolved from Current System)

Preserving what already works, with client-customizable weights:

**Module 1: Resume vs. Job Description** (default 40% weight)
* Semantic matching using vector embeddings
* Skills keyword extraction and matching
* Experience relevance scoring with deductions for irrelevant experience

**Module 2: Good/Bad Indicator Check** (default 30% weight)
* Client-defined positive and negative signals
* Location matching, industry experience, specific project types
* Binary scoring per indicator (present/absent)

**Module 3: Weighted M/R/O Evaluation** (default 30% weight)
* Mandatory skills → flagged if missing
* Required skills → weighted scoring
* Optional skills → bonus points
* Experience years vs. required years

**Client Scoring Configuration UI:**
* Slider interface for adjusting module weights (must sum to 100%)
* Per-indicator point value adjustment
* Penalty severity for missing mandatory skills
* Preview: "Here's how your top 5 candidates would re-rank with these weights"

### 4.3 Talent Pool Matching

**When a new job is created:**

1. AI generates embedding for the job description
2. Searches the talent pool using vector similarity (pgvector)
3. Returns ranked list of existing candidates who match
4. Recruiter reviews suggestions and selects candidates to add to the job
5. Selected candidates get Application records created with source = "ai_matched"
6. AI runs full three-module scoring on each new Application

**When a new candidate joins the talent pool:**

1. AI parses resume and generates candidate embedding
2. Scans all active job openings for matches
3. Notifies recruiter: "New candidate matches 3 open positions"
4. Optionally auto-creates Applications if above a confidence threshold

### 4.4 Profile Enrichment Pipeline

**Automated enrichment when a candidate enters the system:**

```
Candidate created (name + email + resume)
    ↓
Resume parsed by Claude API → structured data extracted
    ↓
Email verified via Hunter.io
    ↓
Profile enriched via People Data Labs or Apollo
    (LinkedIn URL, phone, company, title, social profiles)
    ↓
LinkedIn profile data pulled (if approved integration)
    ↓
Candidate record updated with enriched data
    ↓
Talent score calculated based on completeness + quality signals
    ↓
Status set to "enriched" with timestamp
```

### 4.5 General Talent Score (Candidate-Level)

Independent of any specific job, every candidate gets a **Talent Score (0-100)** based on:

| Factor | Weight | Criteria |
|---|---|---|
| Profile completeness | 20% | How many fields filled out |
| Experience depth | 25% | Years, progression, industry relevance |
| Skill breadth | 20% | Number and variety of verified skills |
| Certification quality | 15% | Recognized certifications |
| Engagement | 10% | Activity on platform, response rate |
| Enrichment quality | 10% | Verified email/phone, LinkedIn, etc. |

This score helps recruiters quickly identify high-quality candidates for new jobs before they're even matched.

---

## Part 5: Integrations

### 5.1 Job Board Distribution

| Board | Integration Type | Apply Flow | Priority |
|---|---|---|---|
| **Indeed** | Job Sync API (REST/OAuth 2.0) | Indeed Apply → webhook to our system | P1 — Highest volume |
| **LinkedIn** | Job Posting API + RSC (REST/OAuth 2.0) | LinkedIn native → RSC callback | P1 — Highest quality |
| **ZipRecruiter** | XML/JSON feed + webhook | ZipRecruiter Apply → webhook | P1 — Good for construction |
| **Google for Jobs** | JSON-LD schema markup on job pages | Redirects to our apply page | P1 — Free, high visibility |
| **Glassdoor** | Partner API (if approved) | Glassdoor native | P2 — Brand visibility |
| **CareerBuilder** | Enterprise integration | CareerBuilder flow | P3 — Declining relevance |
| **Handshake** | Web-based (no API) | Handshake native | P3 — College recruiting |

**Aggregator Strategy (one-to-many distribution):**

| Aggregator | Reach | Best For |
|---|---|---|
| **VONQ HAPI** | 1,600+ channels, 50+ free organic boards | Wide distribution, includes free boards |
| **Appcast** | 30,000+ sites, programmatic optimization | Sponsored jobs, CPA-based |
| **Broadbean** | 7,000+ boards, 100+ countries | International recruiting |

**Recommendation:** Start with direct Indeed + LinkedIn + Google for Jobs. Add VONQ for broad distribution. Use Appcast for paid/sponsored campaigns.

### 5.2 Enrichment APIs

| Service | Use | Cost | Priority |
|---|---|---|---|
| **People Data Labs** | Primary enrichment (email → full profile) | $98/mo + $0.20-0.28/contact | P1 |
| **Hunter.io** | Email discovery + verification | $50/mo | P1 |
| **Apollo.io** | Secondary enrichment, continuous pipeline | $0.20/credit | P2 |
| **SignalHire** | Phone number accuracy (95%) | Custom pricing | P2 |
| **RocketReach** | High-confidence direct phone | $2,099/yr (Ultimate) | P3 |
| **Clearbit (HubSpot)** | Company data, tech stack signals | $499-1,200/mo | P3 |

**Enrichment budget at scale:**
* 200 candidates/month: ~$200/mo (PDL + Hunter)
* 500 candidates/month: ~$500/mo
* 1,000+ candidates/month: ~$800-1,500/mo

### 5.3 Other Integrations

| Integration | Purpose |
|---|---|
| **HubSpot CRM** | Sync client records, track recruiting pipeline alongside sales |
| **Google Workspace** | Calendar for interview scheduling, Gmail for email |
| **Slack** | Internal notifications for recruiter team |
| **ClickUp** | Task management for recruiter workflows |
| **Twilio/SendGrid** | SMS + email for notifications and messaging |
| **Stripe** | Billing for future SaaS clients (if productized) |

---

## Part 6: Notifications System

### Notification Types

| Notification | Recipients | Channels | Trigger |
|---|---|---|---|
| New application received | Recruiter, Client (if configured) | Email, in-app | Candidate applies |
| AI scoring complete | Recruiter | In-app | AI finishes processing |
| New candidate matches job | Recruiter | Email digest, in-app | Talent pool match found |
| Application status change | Candidate | Email, in-app | Status updated |
| Client feedback received | Recruiter | In-app | Client leaves feedback |
| Daily new candidates digest | Recruiter, Client (optional) | Email | Daily 8am summary |
| Job closing soon | Recruiter, Client | Email | 7 days before close date |
| Interview scheduled | All parties | Email, calendar invite | Interview booked |

### Notification Configuration (Per Job Opening)

When creating a job, the creator can set:

* **Notification frequency:** Real-time, daily digest, weekly digest, or none
* **Who gets notified:** Assigned recruiter, client admin, all client users, or specific people
* **Channels:** Email only, in-app only, email + in-app, or email + SMS
* **Thresholds:** Only notify for candidates scoring above X%

### Notification Configuration (Per User)

Each user can override their preferences:

* **Global mute** — Turn off all non-critical notifications
* **Per-channel control** — Email on, SMS off, in-app on
* **Digest preference** — Real-time or batched
* **Do Not Disturb hours** — No notifications between X and Y

---

## Part 7: Reporting & Analytics

### Client-Level Reports

* Candidates per job (with score distribution)
* Time-to-fill per job
* Source effectiveness (which job board produces best candidates)
* Pipeline funnel (applied → scored → shortlisted → interviewed → offered → hired)
* Scoring accuracy (do high-scored candidates get hired more often?)

### Company-Wide Metrics (Purely Works Internal)

* Total candidates in talent pool (by skill, location, industry, experience level)
* Total active jobs across all clients
* Placements per month/quarter
* Average time-to-fill by industry
* Revenue per placement (if tracked)
* Job board ROI (spend vs. quality of applicants)
* Enrichment coverage (% of candidates fully enriched)

### Marketing-Ready Stats

Aggregated, anonymized numbers for marketing materials:

* "X,000+ professionals in our talent pool"
* "Candidates across Y industries"
* "Average Z days to first qualified candidate"
* "Recruiters serving N+ active clients"
* Breakdowns by: geography, industry, role type, experience level

---

## Part 8: Messaging System

### Message Types

| Type | From → To | Sent As | Use Case |
|---|---|---|---|
| Recruiter → Client | Purely Works recruiter → Client user | On behalf of Purely Works | Sharing shortlists, updates |
| Recruiter → Candidate | Purely Works recruiter → Candidate | On behalf of Purely Works OR client | Interview scheduling, status updates |
| Client → Recruiter | Client user → Recruiter | Client identity | Feedback, requests |
| Client → Candidate | Client user → Candidate | On behalf of client | Direct communication |
| System → Any | Automated | System/platform | Notifications, reminders |

### Key Messaging Features

* **Send on behalf of** — Recruiters can send messages that appear to come from the client (with client's branding, signature)
* **Thread-based** — Messages organized by conversation thread
* **Linked to context** — Every message can be linked to a specific candidate, application, or job
* **Multi-channel** — Send via in-app, email, or SMS (candidate preference)
* **Templates** — Pre-built message templates for common scenarios (interview invite, rejection, offer, etc.)

---

## Part 9: Tech Stack

### Recommended Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS | Full-stack, SSR, dynamic tenant branding |
| **UI Components** | shadcn/ui + Radix | Accessible, customizable component library |
| **Backend API** | Python/Django REST Framework + Celery | Rapid development, AI/ML integration, async tasks |
| **Real-time** | Node.js + Socket.io microservice | WebSocket notifications, live updates |
| **Database** | PostgreSQL 16 + Row-Level Security | Multi-tenant data isolation |
| **Vector Search** | pgvector (PostgreSQL extension) | Resume/JD embedding similarity search |
| **Full-text Search** | Elasticsearch | Candidate search, job search, filters |
| **AI/ML** | Claude API (Anthropic) | Resume parsing, JD generation, scoring, matching |
| **Skills Taxonomy** | Lightcast API + custom taxonomy | Standardized skill vocabulary |
| **File Storage** | AWS S3 | Resume documents, attachments |
| **Email** | SendGrid | Transactional + marketing emails |
| **SMS** | Twilio | Notifications, messaging |
| **Notifications** | Courier.com | Multi-channel orchestration |
| **Auth** | Auth0 | Multi-tenant SSO, magic link, RBAC |
| **Hosting** | AWS (ECS/Fargate) | Container-based, auto-scaling |
| **CI/CD** | GitHub Actions + Docker | Automated deployment |
| **Monitoring** | Datadog | Performance, errors, logs |
| **CDN** | Cloudflare | Static assets, custom domains |

---

## Part 10: Development Roadmap

### Phase 1: Foundation (Months 1-3)

**Goal:** Core platform with recruiter dashboard and basic client portal

**Backend:**
* PostgreSQL database with RLS multi-tenancy
* Django REST API — auth, tenants, users, candidates, jobs, applications
* Resume upload + Claude API parsing pipeline
* Basic three-module AI scoring (port logic from current Airtable system)
* Auth0 integration with role-based access

**Frontend:**
* Next.js app with tenant-aware routing
* Recruiter dashboard: talent pool, job management, application pipeline
* Client portal: job list, candidate pipeline, feedback forms
* Candidate portal: profile creation, resume upload, job browse + apply

**Estimated Effort:** 2 senior full-stack devs + 1 AI/ML engineer
**Cost:** ~$36,000-54,000 (at our dev rates: 3 FTE × 3 months × $4,000-6,000/FTE)

### Phase 2: AI & Matching (Months 4-5)

**Goal:** Smart matching, enrichment, AI job creation

**Features:**
* Vector embeddings for candidate-job semantic matching (pgvector)
* Talent pool search: "Find candidates similar to this job"
* AI job description generation (Claude + Lightcast taxonomy)
* Auto-suggest M/R/O skills from generated JD
* Profile enrichment pipeline (People Data Labs + Hunter.io)
* Talent Score algorithm (candidate-level quality scoring)
* Client scoring configuration UI (weight sliders)

**Estimated Effort:** 1 AI/ML engineer + 1 full-stack dev
**Cost:** ~$16,000-24,000

### Phase 3: Job Board Integration (Months 5-6)

**Goal:** Publish jobs to external boards, receive applications via webhook

**Features:**
* Indeed Job Sync API integration (posting + Indeed Apply webhook)
* LinkedIn Job Posting API + Recruiter System Connect
* Google for Jobs schema markup on all job pages
* ZipRecruiter feed + webhook integration
* VONQ HAPI for broad distribution (1,600+ boards)
* Job Board Postings tracking (clicks, applicants, spend per board)
* Unified applicant ingestion: all external applications flow into Applications table

**Estimated Effort:** 2 full-stack devs (integration-heavy)
**Cost:** ~$16,000-24,000

**API Partner Costs:**
* Indeed: Partner agreement (free or revenue-share)
* LinkedIn: Talent Solutions partnership (custom pricing)
* VONQ: Custom pricing based on volume
* ZipRecruiter: ATS partner agreement

### Phase 4: Communication & Notifications (Months 6-7)

**Goal:** In-platform messaging, multi-channel notifications, email/SMS

**Features:**
* In-app messaging system (threaded, linked to candidates/applications)
* "Send on behalf of" functionality (recruiter sends as client)
* Email integration via SendGrid (transactional + templates)
* SMS integration via Twilio (for candidate communications)
* Notification engine via Courier.com
* Per-job and per-user notification configuration
* Daily digest emails
* Real-time WebSocket notifications (Node.js microservice)

**Estimated Effort:** 1 full-stack dev + 1 frontend dev
**Cost:** ~$16,000-24,000

**Service Costs:**
* SendGrid: ~$20-90/mo (depending on volume)
* Twilio: ~$0.01/SMS
* Courier.com: Free tier → $500/mo at scale

### Phase 5: Branded Portals & Job Board (Months 7-8)

**Goal:** Public-facing client job portals and company-wide job board

**Features:**
* Client-branded job portal pages (custom domain, logo, colors)
* Company-wide job board (jobs.purelyworks.com)
* SEO-optimized job pages with Google for Jobs schema
* Candidate self-service: build profile, manage applications, set preferences
* One-click apply using existing profile
* Mobile-responsive design
* Social sharing for job posts

**Estimated Effort:** 1 frontend dev + 1 designer
**Cost:** ~$12,000-18,000

**Infrastructure Costs:**
* Cloudflare (custom domains): ~$20/mo per domain
* SSL certificates: included with Cloudflare

### Phase 6: Enrichment & Intelligence (Months 8-9)

**Goal:** Automated profile enrichment, Apollo/LinkedIn integration

**Features:**
* Automated enrichment pipeline (on candidate creation)
* People Data Labs integration (primary enrichment)
* Apollo.io integration (secondary enrichment, continuous pipeline)
* Hunter.io email verification
* SignalHire phone number lookup (for priority candidates)
* Enrichment dashboard (coverage metrics, data quality)
* LinkedIn profile viewer (where available through approved integration)

**Estimated Effort:** 1 backend dev + 1 data engineer
**Cost:** ~$12,000-18,000

**API Costs (monthly):**
* People Data Labs: $98-500/mo
* Hunter.io: $50/mo
* Apollo.io: $100-500/mo
* SignalHire: Custom

### Phase 7: Analytics & Marketing (Months 9-10)

**Goal:** Comprehensive reporting, exportable metrics, marketing stats

**Features:**
* Client-level dashboards (pipeline funnel, time-to-fill, score distributions)
* Company-wide analytics (talent pool demographics, placement rates)
* Marketing-ready stat generation (anonymized, aggregated)
* Export to PDF/CSV
* Automated weekly/monthly reports
* Job board ROI tracking (spend vs. quality per board)
* Scoring accuracy analysis (do high scores correlate with hires?)

**Estimated Effort:** 1 full-stack dev + 1 data analyst
**Cost:** ~$12,000-18,000

### Phase 8: Polish & Scale (Months 10-12)

**Goal:** Performance optimization, edge cases, enterprise readiness

**Features:**
* Performance optimization (Elasticsearch tuning, query optimization)
* Audit logging (who did what when — compliance)
* Data export/import tools
* Bulk operations (mass apply, mass score, mass enrich)
* Advanced search filters
* Keyboard shortcuts for power users
* Mobile app (React Native or PWA)
* Load testing and security audit
* Documentation and onboarding guides

**Estimated Effort:** Full team (3-4 devs)
**Cost:** ~$36,000-54,000

---

## Part 11: Budget Summary

### Development Investment

| Phase | Duration | Description | Team Size | Cost Range |
|---|---|---|---|---|
| Phase 1 | Months 1-3 | Foundation (core platform) | 3 devs | $36K-54K |
| Phase 2 | Months 4-5 | AI & Matching | 2 devs | $16K-24K |
| Phase 3 | Months 5-6 | Job Board Integration | 2 devs | $16K-24K |
| Phase 4 | Months 6-7 | Communication & Notifications | 2 devs | $16K-24K |
| Phase 5 | Months 7-8 | Branded Portals & Job Board | 2 devs | $12K-18K |
| Phase 6 | Months 8-9 | Enrichment & Intelligence | 2 devs | $12K-18K |
| Phase 7 | Months 9-10 | Analytics & Marketing | 2 devs | $12K-18K |
| Phase 8 | Months 10-12 | Polish & Scale | 3-4 devs | $36K-54K |
| **Total** | **12 months** | | | **$156K-234K** |

### Monthly Operating Costs (at scale)

| Service | Monthly Cost | Notes |
|---|---|---|
| AWS Hosting (ECS/Fargate) | $500-2,000 | Scales with usage |
| PostgreSQL (RDS) | $200-800 | Multi-AZ for reliability |
| Elasticsearch | $200-500 | Managed service |
| Auth0 | $100-500 | Based on active users |
| SendGrid | $20-90 | Email volume |
| Twilio | $50-200 | SMS volume |
| Courier.com | $0-500 | Notification orchestration |
| People Data Labs | $98-500 | Enrichment volume |
| Hunter.io | $50 | Email verification |
| Apollo.io | $100-500 | Secondary enrichment |
| Cloudflare | $20-100 | CDN, custom domains |
| Claude API (Anthropic) | $200-1,000 | AI scoring, parsing, generation |
| Datadog | $100-300 | Monitoring |
| **Total Monthly** | **$1,640-7,000** | |
| **Annual Operating** | **$20K-84K** | |

---

## Part 12: Revenue & ROI Model

### How This Generates Revenue

**Scenario 1: Internal Tool (Current Model)**
* Purely Works uses the platform to serve recruiting clients
* Increases recruiter efficiency by 3-5x (AI does the screening)
* Enables more clients per recruiter
* Revenue comes from client retainers ($3K-13K/month per client)

**Scenario 2: SaaS Product (Future Option)**
* License the platform to other recruiting agencies
* Pricing: $500-2,000/month per agency + per-seat for client portals
* Revenue: Recurring SaaS MRR on top of services revenue

**ROI Calculation (Internal Tool):**

| Metric | Before (Airtable) | After (Purely Recruit) |
|---|---|---|
| Candidates screened per recruiter per day | 20-30 | 100-200 (AI handles scoring) |
| Time to first shortlist | 3-5 days | Same day |
| Clients per recruiter | 2-3 | 5-8 |
| Monthly revenue per recruiter | $10K-20K | $25K-50K |
| Candidate sourcing | Manual only | AI talent pool matching + job boards |
| Client satisfaction | Ad hoc updates | Self-service portal + real-time visibility |

**Break-even:** At 5 recruiting clients ($30K MRR), the platform pays for itself in monthly operating costs within the first quarter. The development investment pays back within 6-12 months of full deployment.

---

## Part 13: Security & Compliance

### Data Isolation
* PostgreSQL Row-Level Security on all tenant-scoped tables
* API middleware validates tenant context on every request
* No cross-tenant data leakage possible at database level

### Candidate Privacy
* Candidates control their profile visibility
* Client portals only show candidates who applied to their jobs
* Enrichment data stored with consent tracking
* Data deletion on candidate request (GDPR/CCPA compliance)

### Access Control
* Auth0 with MFA support
* Role-based access (platform admin, recruiter, client admin, client user, candidate)
* Session management with automatic timeout
* Audit log of all data access and modifications

### Resume Security
* Resumes stored in S3 with encryption at rest
* Signed URLs for time-limited access
* No public access to resume files

---

## Appendix A: Migration Plan (Airtable → Purely Recruit)

### Phase 1: Data Export
* Export all Airtable tables to CSV/JSON
* Map Airtable fields to new database schema
* Import historical data into PostgreSQL

### Phase 2: Parallel Running
* Run new platform alongside Airtable for 2-4 weeks
* Validate AI scoring produces consistent results
* Verify client data isolation works correctly

### Phase 3: Cutover
* Migrate all active job openings and applications
* Redirect client access to new portal
* Decommission Airtable base

### Data Mapping

| Airtable Table | New Entity | Notes |
|---|---|---|
| Applicants | candidates | 1:1 mapping |
| Job Openings | job_openings | Add tenant_id |
| Scoring Records | applications | Split from Airtable junction |
| Software/Hard Skills/Soft Skills/Certificates | skills | Unified taxonomy table |
| CMResume | resumes (parsed_data) | Structured data in JSONB |
| User Database | users (role=candidate) | Migrate to Auth0 |
| Scoring Records - All Applicants | SQL view | Replaced by queries |
| Candidate Extraction | candidates (with status) | Merge into candidates |
| CandidateOutput | API endpoint | Replaced by REST API |

---

## Appendix B: Competitive Landscape

### How We Compare

| Feature | Purely Recruit | Greenhouse | Lever | Workable |
|---|---|---|---|---|
| AI Scoring (3-module) | Custom, client-configurable | Basic keyword | Basic | AI-assisted |
| Multi-tenant Client Portals | Native, white-labeled | No | No | No |
| Talent Pool with Candidate Profiles | Built-in, interactive | Limited | Limited | Yes |
| Job Board Distribution | Direct API + aggregators | Via partners | Via partners | Built-in |
| M/R/O Skill Framework | Unique differentiator | No | No | No |
| Client Scoring Configuration | Per-client weights | No | No | No |
| Profile Enrichment | Automated pipeline | Via partners | Via partners | Built-in |
| Recruiter-to-Client Messaging | Native, on-behalf-of | No | No | Limited |
| Custom Good/Bad Indicators | Per-job, per-client | No | No | No |
| Self-Service Candidate Portal | Full profile builder | Basic | Basic | Basic |

**Our differentiation:** The three-module scoring with client-customizable weights, combined with the M/R/O skill framework and dedicated client portals, is unique in the market. No existing ATS gives clients the ability to tune scoring weights or define custom Good/Bad indicators per job.

---

*This proposal outlines a 12-month development roadmap to build Purely Recruit from the ground up. The phased approach allows us to start serving clients with a functional MVP in 3 months while progressively adding AI, integrations, and polish over the following 9 months.*

*Let's build something extraordinary together.*

---

**Prepared by Purely Works — AI-Enabled Services**
**www.purelystartup.com**
