# Purely Works — AI-Powered Applicant Tracking & Scoring System

## System Analysis & Architecture Documentation

> **Base ID:** `appjRIYMHpzycxDRU`
> **Primary Client:** CM Solutions (construction management recruiting)
> **Secondary Client:** BrioSolutions (staffing & recruiting)
> **Purpose:** AI-automated candidate-to-job matching, scoring, and recruiter decision support

---

## What This System Does

This Airtable base is the **core recruiting operations engine** for Purely Works' staffing service line. It automates the most time-intensive part of recruiting — screening and scoring candidates against job requirements — using a three-module AI scoring system.

**In plain terms:** Resumes come in, get parsed and stored. Job openings are created with specific skill requirements categorized by importance (Mandatory, Required, Optional). An AI engine compares each candidate against each job, produces a detailed score across three modules, flags missing mandatory criteria, and recommends whether to move forward — all before a recruiter ever looks at the candidate.

The system serves **two primary clients** (CM Solutions and BrioSolutions) and is built to scale across additional accounts.

---

## System Architecture — The 12 Tables

### Core Operations (3 tables — the engine)

| Table | Purpose | Record Count Context |
|---|---|---|
| **Applicants** | Master candidate database — personal info, resume, parsed skills, source, salary expectations | Every candidate enters here first |
| **Job Openings** | Client job listings with M/R/O skill requirements, good/bad indicators, and job descriptions | Each open position gets a row |
| **Scoring Records** | The junction table — links one Applicant to one Job Opening with full AI scoring output | One record per applicant-job combination |

### Reference/Lookup Tables (4 tables — the skill taxonomy)

| Table | Purpose |
|---|---|
| **Software** | Master list of software tools (AutoCAD, Primavera P6, MS Office, etc.) with categories |
| **Hard Skills** | Technical competencies (cost engineering, scheduling, etc.) with categories |
| **Soft Skills** | Interpersonal abilities (communication, leadership, etc.) |
| **Certificates** | Professional certifications (PMP, LEED, PE, etc.) with categories |

These lookup tables power the M/R/O dropdowns in Job Openings and serve as the taxonomy the AI scores against.

### Output & Integration Tables (3 tables — downstream)

| Table | Purpose |
|---|---|
| **Scoring Records - All Applicants** | Consolidated cross-job scoring view — shows all applicant scores across all jobs in one place |
| **CMResume** | CM Solutions-specific resume formatting — extracts parsed candidate data into a client-branded resume format |
| **CandidateOutput** | Integration endpoint — structured output data for external systems or reporting |

### Pipeline & Infrastructure (2 tables)

| Table | Purpose |
|---|---|
| **Candidate Extraction** | Early-stage sourcing pipeline — tracks candidates being sourced/extracted before they enter the main Applicants table |
| **User Database** | Softr front-end portal authentication — manages external user access via magic links |

---

## The Data Flow — How It Works End-to-End

```
Step 1: INTAKE
Candidates sourced (Indeed, LinkedIn, direct)
    → Entered into Applicants table
    → Resume attached + parsed into structured fields

Step 2: JOB SETUP
Client submits job opening
    → Created in Job Openings table
    → Skills categorized as M/R/O across 4 dimensions:
        * Software (M, R, O)
        * Hard Skills (M, R, O)
        * Soft Skills (M, R, O)
        * Certificates (M, R, O)
    → Good/Bad indicators defined
    → Full job description attached

Step 3: AI SCORING (triggered by Startworkflow field)
Applicant linked to Job Opening
    → Creates Scoring Record
    → AI processes three scoring modules:

    MODULE 1: Resume vs. Job Description (text matching)
    MODULE 2: Good/Bad Indicator Check (positive/negative signals)
    MODULE 3: Weighted Score (M/R/O criteria evaluation)

    → Outputs: Final Score, Flags, Recommendation, Notes, Alt Position Suggestion

Step 4: RECRUITER REVIEW
Recruiter reviews AI output
    → Adds Recruiter Score (%) and Recruiter Notes
    → Sets Decision (New → Reviewed → Interviewed → etc.)
    → AI Recommendation vs. Recruiter judgment compared

Step 5: CLIENT DELIVERY
    → CMResume formats candidate for client submission
    → CandidateOutput structures data for integration
    → Softr portal provides client-facing access
```

---

## The AI Scoring System — Three Modules Deep

This is the heart of the build. Each Scoring Record runs through three distinct evaluation modules:

### Module 1: Resume Text vs. Job Description
**What it does:** Compares the raw resume content against key elements from the job description.

**How it scores:**
* Skills matched → 4-5 points each
* Experience relevance → up to 10 points
* Certifications matched → 3-4 points each
* Responsibilities matched → 1.5-2 points each
* Irrelevant experience → **deducts** -10 points
* Irrelevant certifications → **deducts** -2 points

**Output:** Percentage score out of 100

### Module 2: Good Things to Look for / Bad Things to Watch Out for
**What it does:** Checks the candidate against job-specific positive and negative indicators that the client has defined.

**Example positive indicators (CM Solutions LAWA jobs):**
* Previous LAX experience → +10 points
* Lives in greater LA → +10 points
* Caltrans or City of LA experience → +10 points

**Example negative indicators:**
* Residential or commercial experience → -10 points
* Does not live in Southern California → -10 points

**Output:** Percentage score (can go negative if bad indicators outweigh good)

### Module 3: Weighted Score Calculation
**What it does:** Evaluates the candidate specifically against the M/R/O skill requirements defined in the Job Opening.

**How it scores:**
* Mandatory criteria matched → weighted heavily
* Required criteria matched → moderate weight
* Nice-to-have criteria → lower weight
* Missing mandatory criteria → **flagged**

**Output:**
* Weighted Points (raw number)
* Weighted Score in Percentage
* Total Flags for Missing Mandatory Criteria (count)
* Flags Description (text listing what's missing)

### Final Score Calculation
The three modules combine into:

| Field | What It Represents |
|---|---|
| **Score Based on Job Description** | Module 1 percentage |
| **Score Based on Questions** | Module 2 percentage |
| **Weighted Score in Percentage** | Module 3 percentage |
| **Final Overall Score** | Combined score out of 100 |
| **Total Flags for Missing Mandatory Criteria** | Number of critical gaps |

### AI Recommendation Output
After scoring, the AI produces:

* **AI Recommendation** — Recommended / Not Recommended
* **AI Based Notes** — Summary of flags and missing criteria
* **AI Based Recommendation and Comments** — Detailed narrative with strengths, weaknesses, and specific observations
* **Recommendation for an Alternative Position** — If the candidate isn't a fit for this role, what role they might fit

---

## The M/R/O Skill Framework

This is the **classification system** that makes the AI scoring work. Every Job Opening categorizes required skills into three tiers across four skill dimensions:

| Tier | Meaning | Scoring Impact |
|---|---|---|
| **M (Mandatory)** | Must-have — candidate is flagged if missing | Missing = flag + score deduction |
| **R (Required/Recommended)** | Strongly preferred — contributes significant weight | Missing = score reduction, no flag |
| **O (Optional/Nice-to-Have)** | Bonus — adds points but not required | Missing = no penalty |

**Applied across 4 dimensions:**

| Dimension | M Column | R Column | O Column |
|---|---|---|---|
| Software | Software (M) | Software (R) | Software (O) |
| Hard Skills | Hard Skills (M) | Hard Skills (R) | Hard Skills (O) |
| Soft Skills | Soft Skills (M) | Soft Skills (R) | Soft Skills (O) |
| Certificates | Certificates (M) | Certificates (R) | Certificates (O) |

This gives 12 skill requirement fields per job opening, pulling from the 4 reference lookup tables.

---

## Automation & Workflow Triggers

### The Startworkflow Field
Present in both Scoring Records and Applicants tables. Values observed: `"Done"`

**What this does:** This field likely triggers a Make.com (or Zapier) automation that:
1. Detects when a new Scoring Record is created or updated
2. Sends the applicant resume + job description to an AI processing endpoint
3. Receives the three-module scoring output back
4. Populates all AI fields in the Scoring Record
5. Sets `AI Based Process` to `"Processed"` and `Status` to `"Done"`
6. Sets `Startworkflow` to `"Done"` to prevent re-processing

### The AI Based Process Field
Tracks whether AI scoring has been completed:
* **Processed** — AI has scored this record
* (Blank/other) — Awaiting processing

### The Decision Field
Human workflow status after AI processing:
* **New** — AI scored, not yet reviewed by recruiter
* **Reviewed** — Recruiter has reviewed the AI output
* **Interviewed** — Candidate has been interviewed
* (Likely additional stages for submitted, hired, rejected)

---

## Client Segmentation

The system is multi-tenant — serving multiple clients from one base.

### CM Solutions (Primary)
* Construction management firm — LAWA (Los Angeles World Airports) projects
* Job types: Project Managers, Cost Engineers, Schedulers, Office Engineers, Contract Administrators
* Heavy focus on airport/infrastructure experience
* Good/Bad indicators tuned for LA-based construction (airport exp = good, residential = bad)
* Has dedicated CMResume table for client-formatted resume output

### BrioSolutions (Secondary)
* Staffing & recruiting firm
* Views organized separately from CM Solutions
* Appears to be a newer or smaller account in this system

### Views by Team Member
The system has personalized views for each recruiter:
* **FK View** — Farid Kheloco
* **AH View** — Armeen Haroon
* **NT View** — (team member)
* **BT View** — (team member)

This lets each recruiter see their assigned candidates without filtering noise.

---

## The Softr Front-End

The **User Database** table powers a Softr-based web portal:

* **Magic Link** authentication — passwordless login for external users
* **User ID** — sequential identifier
* **Softr Created Time** — tracks when user was provisioned
* **Avatar** — profile image support

This portal likely gives clients (CM Solutions, Brio) a self-service view into their candidates and scoring results, without needing direct Airtable access.

---

## The CMResume Table — Client-Specific Output

For CM Solutions specifically, the system generates formatted resumes with:

* **Name, First Name, Last Name** — parsed from applicant data
* **Position** — role being applied for
* **Year of Experience** — extracted from resume
* **Area of Expertise** — AI-generated summary
* **Education** — parsed from resume
* **Professional Accomplishments** — extracted highlights
* **Professional Certifications** — listed certs
* **Professional Organizations** — memberships
* **Approach to Teamwork and Leadership** — AI-generated narrative
* **Software** — tools listed from resume
* **Core Skills** — competencies extracted
* **Jobs Descriptions** — full work history, parsed per role

This is essentially an **AI-powered resume reformatter** that takes raw candidate data and structures it into CM Solutions' preferred format for client presentation.

---

## Key Design Decisions & Logic

### Why three scoring modules instead of one?
Each module evaluates a different dimension:
* Module 1 catches **technical alignment** (does the resume match the JD?)
* Module 2 catches **contextual fit** (do they have the right kind of experience for this specific client?)
* Module 3 catches **mandatory gaps** (are they missing any must-haves?)

A candidate could score high on Module 1 (great resume match) but fail Module 2 (wrong type of experience) or get flagged in Module 3 (missing a certification). The three-module approach prevents false positives.

### Why M/R/O instead of just required/not required?
The three-tier system allows for nuanced matching:
* A candidate missing a **Mandatory** skill gets flagged immediately — recruiter knows this is a dealbreaker
* A candidate missing a **Required** skill loses points but stays in the running
* A candidate with extra **Optional** skills gets bonus points, helping differentiate close candidates

### Why separate lookup tables for skills?
The four reference tables (Software, Hard Skills, Soft Skills, Certificates) serve as a **controlled vocabulary**. This means:
* Skills are standardized across all job openings (no "MS Excel" vs. "Microsoft Excel" inconsistency)
* Skills can be categorized (Software has categories like "Project Management Software", "Construction Management Software")
* The AI can reliably match applicant skills to job requirements because both pull from the same list

### Why the CandidateOutput and Candidate Extraction tables?
These appear to be **pipeline management** layers:
* **Candidate Extraction** — early-stage sourcing before candidates are fully entered (Job Name, Place, Status fields)
* **CandidateOutput** — downstream integration point for pushing scored candidates into external systems or generating reports

---

## Summary: What You've Built

This is a **production-grade, AI-powered ATS (Applicant Tracking System)** purpose-built for construction management recruiting. The key differentiators:

1. **Three-module AI scoring** that evaluates candidates from multiple angles, not just keyword matching
2. **M/R/O skill taxonomy** that mirrors how real hiring managers think about requirements
3. **Client-specific customization** — different good/bad indicators per client, personalized resume formatting
4. **Recruiter-AI collaboration** — AI does the initial heavy lift, recruiters add judgment and context
5. **Multi-tenant architecture** — serves multiple clients from one base with view-based segmentation
6. **External portal** via Softr for client self-service access
7. **Automation pipeline** via Startworkflow triggers for hands-off AI processing

The system effectively turns what would be hours of manual resume screening per candidate into an automated pipeline where recruiters spend their time on qualified candidates instead of sorting through unqualified ones.

---

*Analysis generated February 2026 by Farid's Executive Admin Agent*
