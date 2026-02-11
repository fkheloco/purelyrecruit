# Airtable to Neon Field Mapping Reference

This document provides a complete field-by-field mapping reference for the Airtable to Neon migration.

---

## Table of Contents

1. [Skill Taxonomy Tables](#skill-taxonomy-tables)
2. [Applicants → Candidates](#applicants--candidates)
3. [Applicants → Resumes](#applicants--resumes)
4. [Applicants → Candidate Skills](#applicants--candidate-skills)
5. [Job Openings → Jobs](#job-openings--jobs)
6. [Job Openings → Job Skill Requirements](#job-openings--job-skill-requirements)
7. [Scoring Records → Applications](#scoring-records--applications)
8. [Enum Mappings](#enum-mappings)
9. [Airtable Field IDs Reference](#airtable-field-ids-reference)

---

## Skill Taxonomy Tables

### Soft Skills (tbl5ROVTv7rNr3w3n)

| Airtable Field ID | Airtable Field Name | Target Table | Target Column | Data Type | Notes |
|---|---|---|---|---|---|
| fld8EH1i7bICNMQ8c | Name | skills | name | varchar(255) | Primary identifier |
| fldJmSrHPOC31nDDm | Description | skills | (not used) | text | Unused in migration |
| (auto) | (auto) | skills | category | enum | Set to: `soft_skill` |
| (auto) | (auto) | skills | is_active | boolean | Set to: `true` |

### Hard Skills (tblA1BS6VNBX0THhZ)

| Airtable Field ID | Airtable Field Name | Target Table | Target Column | Data Type | Notes |
|---|---|---|---|---|---|
| fldUa35uboWwHREey | Name | skills | name | varchar(255) | Primary identifier |
| fldC9F8ZlY5s8LapL | Category | skills | subcategory | varchar(255) | Skill subcategory |
| (auto) | (auto) | skills | category | enum | Set to: `hard_skill` |
| (auto) | (auto) | skills | is_active | boolean | Set to: `true` |

### Software (tblKyguCWCvgvcQkt)

| Airtable Field ID | Airtable Field Name | Target Table | Target Column | Data Type | Notes |
|---|---|---|---|---|---|
| fldIlsJezRMLo7iQW | Name | skills | name | varchar(255) | Primary identifier |
| flduJOvR689U6RGpa | Category | skills | subcategory | varchar(255) | Software category |
| (auto) | (auto) | skills | category | enum | Set to: `software` |
| (auto) | (auto) | skills | is_active | boolean | Set to: `true` |

### Certificates (tblAoEIfrIIHWXdVT)

| Airtable Field ID | Airtable Field Name | Target Table | Target Column | Data Type | Notes |
|---|---|---|---|---|---|
| fldGxg90qO1mmw25A | Name | skills | name | varchar(255) | Primary identifier |
| fld8kFyr1HTgAnU23 | Category | skills | subcategory | varchar(255) | Cert category |
| (auto) | (auto) | skills | category | enum | Set to: `certificate` |
| (auto) | (auto) | skills | is_active | boolean | Set to: `true` |

---

## Applicants → Candidates

**Source Table:** Applicants (tblaexcKyvhg3CfUl)
**Target Table:** candidates

| Airtable Field ID | Airtable Field Name | Target Column | Data Type | Transformation | Required |
|---|---|---|---|---|---|
| fldjcorLIc3xvdT1i | First Name | first_name | varchar(100) | Direct copy | No (default: "Unknown") |
| fldpmGcZ6cx3jBHah | Last Name | last_name | varchar(100) | Direct copy | No |
| fldpH2fOVpJyQ7RC9 | Email | email | varchar(255) | Direct copy or generated | Yes* |
| flddEm0ozjLwaIFWU | Phone | phone | varchar(50) | Direct copy | No |
| fldGFaybrLfFuR7sV | LinkedIn | linkedin_url | text | Direct copy | No |
| fldkGYKII8a3mseGE | Professional Title | current_title | varchar(255) | Direct copy | No |
| fldOBkyDfYOS4dHUD | Mailing Address | location_city, location_state | varchar(100) | Parse by comma | No |
| fldA7Qc1IBIrZTz6o | Total Experience | years_experience | integer | Direct copy (years) | No |
| fldKhaihAEvm23HF2 | Experience (Year Started) | years_experience | integer | Calculate: current_year - year_started | No |
| fldnhIoh1NeiSz4xj | Salary (annual) | salary_expectation_min, salary_expectation_max | integer | Min = salary * 0.9, Max = salary | No |
| fldoR0vbTdIm1PRSq | Work Format Preference | availability | enum | Map to availability enum | No (default: "not_looking") |
| fldvzpE3D6ftT0h7g | Recruiting Source | source | varchar(100) | Direct copy | No (default: "airtable_migration") |
| fldboG2wS2VGHOCcd | date (created) | created_at | timestamp | Convert from ISO8601 | No (default: NOW()) |
| (auto) | (auto) | is_profile_public | boolean | Hardcoded | Set to: `true` |
| (auto) | (auto) | location_country | varchar(50) | Hardcoded | Set to: `US` |

**Fields NOT Migrated:**
- fldXynNAuGBnpjMxI (Title) - Airtable record title, not used
- fldsVIDWxXhe1DzFY (Language Skills) - Not mapped
- fld5feYmmYhrBp3uP (Eligibility) - Not mapped
- fldRyVQI2raat9Uda (Will Relocate) - Not mapped
- fldrJc8ohCu09borc (College) - Not mapped
- fldlrKp5oAAhEz5CG (Hourly Rate) - Not mapped
- fldEivyvnzlJCqDto (Role) - Not mapped
- fld44TJEjhTBR2yAF (RecordID) - Airtable internal
- fld4gSebzps6cEo9h (Resume attachment) - File reference, not migrated

*Email: If empty in Airtable, generated as `unknown-{airtable_record_id}@purely-recruit.local`

---

## Applicants → Resumes

**Source Table:** Applicants (tblaexcKyvhg3CfUl)
**Target Table:** resumes

| Airtable Field ID | Airtable Field Name | Target Column | Data Type | Transformation | Condition |
|---|---|---|---|---|---|
| (auto) | (auto) | candidate_id | uuid | Reference to created candidate | Always |
| fldfticZ1kap7H3Yp | Full Text Resume | raw_text | text | Direct copy | Only if present |
| fldfticZ1kap7H3Yp | Full Text Resume | file_url | text | Base64 data URL | Only if present |
| (auto) | (auto) | file_name | varchar(500) | `{first_name}-{last_name}-resume.txt` | Only if present |
| (auto) | (auto) | file_type | varchar(100) | Hardcoded | Set to: `text/plain` |
| (auto) | (auto) | is_primary | boolean | Hardcoded | Set to: `true` |
| fldboG2wS2VGHOCcd | date (created) | uploaded_at | timestamp | Convert from ISO8601 | Only if present |

**Resume Creation Logic:**
- Creates a resume record ONLY if `Full Text Resume` (fldfticZ1kap7H3Yp) is present
- Stores plain text content in `raw_text` column
- Stores data URL in `file_url` for download capability
- Marks as primary resume for candidate

---

## Applicants → Candidate Skills

**Source Table:** Applicants (tblaexcKyvhg3CfUl)
**Target Table:** candidate_skills

**Skill Fields in Applicants:**

| Airtable Field ID | Airtable Field Name | Skill Category | Mapping Notes |
|---|---|---|---|
| fldN2moWS35UeTSSK | Soft Skills | soft_skill | Linked record IDs → skill_id lookup |
| fld0yor7lOYCAF1XM | Hard Skills | hard_skill | Linked record IDs → skill_id lookup |
| fldiNOZZbGY5Sl6NS | Softwares | software | Linked record IDs → skill_id lookup |
| fld1focmnqkiCmpt5 | Certifications | certificate | Linked record IDs → skill_id lookup |

**Target Columns:**

| Target Column | Source | Default | Notes |
|---|---|---|---|
| candidate_id | From candidates migration | N/A | Always set |
| skill_id | Airtable record ID → UUID lookup | N/A | From skill map |
| proficiency | Hardcoded | intermediate | All skills set to intermediate |
| years_experience | N/A | NULL | Not populated from Airtable |
| source | Hardcoded | airtable_migration | Indicates migration source |

**Link Creation Logic:**
- For each skill ID in the four skill fields above:
  1. Look up UUID in skill migration map
  2. If found, create candidate_skill record
  3. If not found, skip with warning and continue
  4. All skills default to "intermediate" proficiency
  5. Source tracked as "airtable_migration"

---

## Job Openings → Jobs

**Source Table:** Job Openings (tbl4XxZEp8g1EZx25)
**Target Table:** job_openings

| Airtable Field ID | Airtable Field Name | Target Column | Data Type | Transformation | Required |
|---|---|---|---|---|---|
| fldoSLW6u6OOpVRHo | Title | title | varchar(500) | Direct copy | Yes (default: "Untitled Position") |
| fldq8uWjx7GTod8DW | Job Description | description | text | Direct copy | No |
| fldnO5L9VVnQcdoZ4 | Good things to look for | good_indicators | text[] | JSON array or string array | No |
| fldr8gQPxI8Gxr4eP | Bad things to watch out for | bad_indicators | text[] | JSON array or string array | No |
| fldlQod6umZFyoPf2 | Location: City | location_city | varchar(100) | Direct copy | No |
| fldLoTWdwEBDE9v5M | Location: State | location_state | varchar(50) | Direct copy | No |
| fldz0xBNWrtiTLkaj | Onsite/Hybrid/Remote | location_type | enum | Map to location_type enum | No (default: "onsite") |
| fldenelJIWAjQgQuz | Stage | status | enum | Map to job_status enum | No (default: "draft") |
| fldUvjqdR6GUXYSVB | Candidate rate | salary_min | integer | Multiply by 1000 (hourly → annual) | No |
| (auto) | (auto) | salary_max | integer | Not populated | Always NULL |
| (auto) | (auto) | employment_type | enum | Hardcoded | Set to: `contract` |
| (auto) | (auto) | tenant_id | uuid | From tenant creation | Always set |
| fldlIb1f2D8fcuFJq | Created | created_at | timestamp | Convert from ISO8601 | Always set |
| fldlIb1f2D8fcuFJq | Created | updated_at | timestamp | Convert from ISO8601 | Always set |

**Fields NOT Migrated:**
- fldGMPdadBfpNaQ4D (Account) - Client reference, not mapped
- fld3AWV69aH2NX3zl (Title for Resume) - Redundant with title
- fldfoWOKiguIv6NHJ (Hiring Manager) - Not mapped
- fldKfdEG5xUn7oFTe (Experience Range) - Not mapped
- fldW6GhFMpqjVr1Zd (Location: Street) - Not mapped
- fldmTb1FPxtNhSRgR (Location: Country) - Not mapped
- fldlK0WNsL8lvwv0b (Location: Postal) - Not mapped
- fldyK6U8GNSfoNKF3 (Resume/RFP due) - Not mapped
- fldJb4HYwZ7ZzRPqC (Education Level) - Not mapped
- fld80sYkgPBrO4H4k (Contract Term) - Not mapped
- fldDCGnWeQi1zf1Z0 (PS Team Notes) - Not mapped
- fldtRiwnIOVV96Zv3 (Client Name) - Not mapped
- fldKuUvDAeEiEP6kg (Job ID for Reference) - Airtable internal

---

## Job Openings → Job Skill Requirements

**Source Table:** Job Openings (tbl4XxZEp8g1EZx25)
**Target Table:** job_skill_requirements

**Skill Fields in Job Openings:**

| Airtable Field ID | Field Name | Importance | Mapping Notes |
|---|---|---|---|
| fldtTRyEm8toilEb8 | Software (Mandatory) | mandatory | Linked record IDs → skill_id lookup |
| fld8Vu2DC5BWZ5O4g | Hard Skills (Mandatory) | mandatory | Linked record IDs → skill_id lookup |
| fldVJHeIDJ0PCJnzj | Soft Skills (Mandatory) | mandatory | Linked record IDs → skill_id lookup |
| fld84RMIASvrWawxd | Certificates (Mandatory) | mandatory | Linked record IDs → skill_id lookup |
| fld231zIH2ErAWc9G | Software (Required) | required | Linked record IDs → skill_id lookup |
| fldY4MrgkQSBxJ9im | Hard Skills (Required) | required | Linked record IDs → skill_id lookup |
| fldqGDVJSFon1OGSe | Soft Skills (Required) | required | Linked record IDs → skill_id lookup |
| fldiwyKZ7tkeU5fHt | Certificates (Required) | required | Linked record IDs → skill_id lookup |
| fldgp3AVHUikSwsDA | Software (Optional) | optional | Linked record IDs → skill_id lookup |
| fldTcJYuh3dORr62t | Hard Skills (Optional) | optional | Linked record IDs → skill_id lookup |
| fldVhNtmiKvlJsM1Y | Soft Skills (Optional) | optional | Linked record IDs → skill_id lookup |
| fldb8Efe2D4qxcynV | Certificates (Optional) | optional | Linked record IDs → skill_id lookup |

**Target Columns:**

| Target Column | Source | Default | Notes |
|---|---|---|---|
| job_opening_id | From job migration | N/A | Always set |
| skill_id | Airtable record ID → UUID lookup | N/A | From skill map |
| importance | From field name above | N/A | mandatory / required / optional |
| min_years | N/A | NULL | Not populated |
| notes | N/A | NULL | Not populated |

**Link Creation Logic:**
- For each skill field in the job:
  1. Determine importance level from field name (M/R/O)
  2. For each skill ID in that field:
     - Look up UUID in skill migration map
     - If found, create job_skill_requirement with importance level
     - If not found, skip with warning
  3. Duplicates are prevented by database unique constraints

---

## Scoring Records → Applications

**Source Table:** Scoring Records (tbloo1HbPDSDBwofh)
**Target Table:** applications

| Airtable Field ID | Airtable Field Name | Target Column | Data Type | Transformation | Required |
|---|---|---|---|---|---|
| fldgIMQZeGmnZx8Rf | Applicants (linked) | candidate_id | uuid | Lookup in candidate map | Yes |
| fldb2IbOK2qC8l5hZ | Job Openings (linked) | job_opening_id | uuid | Lookup in job map | Yes |
| fldemv5V4GGJPadv1 | Final Overall Score (%) | final_score | real | Parse as float | No |
| fldl9uuwBAeqlCd7M | Weighted Score (%) | weighted_score | real | Parse as float | No |
| fldGSVYe3lPZxrwQa | Score Based on Job Description | score_module_1 | real | Parse as float | No |
| fldj8jD26QwAU68uQ | Score Based on Questions | score_module_2 | real | Parse as float | No |
| fldbF1Jz7gXhph195 | Recruiter Score (%) | recruiter_score | real | Parse as float | No |
| fldUPlS2iHBIxzOKH | Status | status | enum | Map to application_status enum | No (default: "new") |
| fldEx8A15OQvkpkc0 | Recruiter Notes | recruiter_notes | text | Direct copy | No |
| fldQA7jITSJ6vdM7L | AI Based Notes | ai_notes | text | Direct copy | No |
| fld2GhnbBLYjV1ZJP | AI Recommendation | ai_recommendation | varchar(50) | Direct copy, truncated | No |
| fld5kkyevAohZJbNG | Decision | recruiter_decision | varchar(100) | Direct copy | No |
| fldM0uAnnZvjdnHKR | Total Flags (missing mandatory) | missing_mandatory_count | integer | Parse as int, default 0 | No |
| fldNs7WewsXlkEKAB | Created | applied_at | timestamp | Convert from ISO8601 | Always set |
| fldNs7WewsXlkEKAB | Created | updated_at | timestamp | Convert from ISO8601 | Always set |
| (auto) | (auto) | tenant_id | uuid | From tenant creation | Always set |
| (auto) | (auto) | source | enum | Hardcoded | Set to: `airtable_migration` |

**Fields NOT Migrated:**
- fldBvyEZzkHeZ1iYg (Name) - Derived, not stored
- fldrPJe7MtDNX3bUC (Client) - Not mapped
- fldzENBH6lZWwWTDl (Score Overview) - Not mapped
- fldWOrWrWNJPmeHx4 (Weightage/Points) - Not mapped
- fldRORbOnD7wi1JSD (Assignee) - Not mapped

**Application Skipping Logic:**
- If Applicants field is empty → Skip record (warning logged)
- If Job Openings field is empty → Skip record (warning logged)
- If applicant not found in migration map → Skip record (warning logged)
- If job not found in migration map → Skip record (warning logged)

---

## Enum Mappings

### Availability Enum (candidates.availability)

```
availability: "immediate" | "two_weeks" | "one_month" | "three_months" | "not_looking"
```

| Airtable Value | Target Value | Meaning |
|---|---|---|
| immediate | immediate | Available to start immediately |
| 2 weeks | two_weeks | Requires 2 weeks notice |
| 1 month | one_month | Requires 1 month notice |
| 3 months | three_months | Requires 3 months notice |
| not looking | not_looking | Currently not looking (default) |
| (empty/null) | not_looking | Default if missing |

### Location Type Enum (job_openings.location_type)

```
location_type: "onsite" | "remote" | "hybrid"
```

| Airtable Value | Target Value | Meaning |
|---|---|---|
| Remote | remote | Fully remote |
| Hybrid | hybrid | Hybrid remote/office |
| Onsite | onsite | Must be in office |
| On-site | onsite | Alternative spelling |
| (empty/null) | onsite | Default if missing |

### Job Status Enum (job_openings.status)

```
status: "draft" | "active" | "paused" | "closed" | "filled"
```

| Airtable Value | Target Value | Meaning |
|---|---|---|
| active | active | Job is open and accepting |
| open | active | Alternative: open for applications |
| draft | draft | Job is in draft, not published |
| pending | draft | Pending review/publication |
| paused | paused | Temporarily closed but not filled |
| closed | closed | Permanently closed |
| filled | filled | Position has been filled |
| (empty/null) | draft | Default if missing |

### Application Status Enum (applications.status)

```
status: "new" | "ai_processing" | "scored" | "reviewed" | "shortlisted" | "interviewing" | "offered" | "hired" | "rejected" | "withdrawn"
```

| Airtable Value | Target Value | Meaning |
|---|---|---|
| new | new | New application |
| submitted | new | Submitted, treating as new |
| ai_processing | ai_processing | Being processed by AI |
| scored | scored | AI has scored |
| reviewed | reviewed | Reviewed by recruiter |
| shortlisted | shortlisted | Moved forward to interviews |
| interviewing | interviewing | In interview process |
| offered | offered | Job offer made |
| hired | hired | Candidate hired |
| rejected | rejected | Rejected candidate |
| withdrawn | withdrawn | Candidate withdrew |
| (empty/null) | new | Default if missing |

### Skill Category Enum (skills.category)

```
category: "soft_skill" | "hard_skill" | "software" | "certificate"
```

Determined by which Airtable table the skill comes from:
- Soft Skills table → `soft_skill`
- Hard Skills table → `hard_skill`
- Software table → `software`
- Certificates table → `certificate`

### Job Skill Importance Enum (job_skill_requirements.importance)

```
importance: "mandatory" | "required" | "optional"
```

Determined by field name in Job Openings:
- Fields with "(Mandatory)" → `mandatory`
- Fields with "(Required)" → `required`
- Fields with "(Optional)" → `optional`

### Candidate Skill Proficiency Enum (candidate_skills.proficiency)

```
proficiency: "beginner" | "intermediate" | "advanced" | "expert"
```

All migrated candidate skills are set to `intermediate` (no proficiency data in Airtable).

---

## Airtable Field IDs Reference

### Applicants Table (tblaexcKyvhg3CfUl)

```typescript
const APPLICANT_FIELDS = {
  title: "fldXynNAuGBnpjMxI",                    // Record title
  firstName: "fldjcorLIc3xvdT1i",               // First name
  lastName: "fldpmGcZ6cx3jBHah",                // Last name
  salary: "fldnhIoh1NeiSz4xj",                  // Annual salary
  phone: "flddEm0ozjLwaIFWU",                   // Phone number
  professionalTitle: "fldkGYKII8a3mseGE",      // Job title
  email: "fldpH2fOVpJyQ7RC9",                   // Email address
  linkedin: "fldGFaybrLfFuR7sV",                // LinkedIn URL
  role: "fldEivyvnzlJCqDto",                    // Role
  languageSkills: "fldsVIDWxXhe1DzFY",         // Languages
  eligibility: "fld5feYmmYhrBp3uP",            // Work eligibility
  recruitingSource: "fldvzpE3D6ftT0h7g",       // Where found
  experienceYearStarted: "fldKhaihAEvm23HF2", // Year started
  hourlyRate: "fldlrKp5oAAhEz5CG",             // Hourly rate
  mailingAddress: "fldOBkyDfYOS4dHUD",         // Full address
  workFormatPreference: "fldoR0vbTdIm1PRSq",   // Availability
  willRelocate: "fldRyVQI2raat9Uda",           // Relocation
  college: "fldrJc8ohCu09borc",                // Education
  softwares: "fldiNOZZbGY5Sl6NS",              // Software skills (linked)
  certifications: "fld1focmnqkiCmpt5",         // Certs (linked)
  hardSkills: "fld0yor7lOYCAF1XM",             // Hard skills (linked)
  softSkills: "fldN2moWS35UeTSSK",             // Soft skills (linked)
  status: "fldnOuv0qDLaHioPI",                 // Current status
  fullTextResume: "fldfticZ1kap7H3Yp",         // Resume text
  resume: "fld4gSebzps6cEo9h",                 // Resume attachment
  totalExperience: "fldA7Qc1IBIrZTz6o",        // Years experience
  created: "fldboG2wS2VGHOCcd",                // Created date
  recordId: "fld44TJEjhTBR2yAF",               // Record ID
};
```

### Job Openings Table (tbl4XxZEp8g1EZx25)

```typescript
const JOB_OPENING_FIELDS = {
  title: "fldoSLW6u6OOpVRHo",                   // Job title
  account: "fldGMPdadBfpNaQ4D",                 // Client (linked)
  titleForResume: "fld3AWV69aH2NX3zl",         // Resume title
  hiringManagerOrGroup: "fldfoWOKiguIv6NHJ",  // Hiring manager
  experienceRange: "fldKfdEG5xUn7oFTe",       // Exp range
  candidateRate: "fldUvjqdR6GUXYSVB",         // Pay rate
  locationStreet: "fldW6GhFMpqjVr1Zd",        // Street
  locationCity: "fldlQod6umZFyoPf2",          // City
  locationState: "fldLoTWdwEBDE9v5M",         // State
  locationCountry: "fldmTb1FPxtNhSRgR",       // Country
  locationPostal: "fldlK0WNsL8lvwv0b",        // ZIP code
  resumeRfpDueDate: "fldyK6U8GNSfoNKF3",      // Due date
  onsiteHybridRemote: "fldz0xBNWrtiTLkaj",    // Work location
  educationLevel: "fldJb4HYwZ7ZzRPqC",        // Min education
  contractTermMonths: "fld80sYkgPBrO4H4k",    // Contract length
  stage: "fldenelJIWAjQgQuz",                 // Job status
  jobDescription: "fldq8uWjx7GTod8DW",        // Full description
  goodThingsToLookFor: "fldnO5L9VVnQcdoZ4",   // Good indicators
  badThingsToWatchOut: "fldr8gQPxI8Gxr4eP",   // Bad indicators
  psTeamNotes: "fldDCGnWeQi1zf1Z0",           // Notes
  created: "fldlIb1f2D8fcuFJq",               // Created date
  clientName: "fldtRiwnIOVV96Zv3",            // Client name
  jobIdForReference: "fldKuUvDAeEiEP6kg",     // Job ID
  // Mandatory skills
  softwareMandatory: "fldtTRyEm8toilEb8",    // Software (M)
  hardSkillsMandatory: "fld8Vu2DC5BWZ5O4g",  // Hard skills (M)
  softSkillsMandatory: "fldVJHeIDJ0PCJnzj",  // Soft skills (M)
  // Required skills
  softwareRequired: "fld231zIH2ErAWc9G",      // Software (R)
  hardSkillsRequired: "fldY4MrgkQSBxJ9im",    // Hard skills (R)
  softSkillsRequired: "fldqGDVJSFon1OGSe",    // Soft skills (R)
  certificatesRequired: "fldiwyKZ7tkeU5fHt",  // Certs (R)
  // Optional skills
  softwareOptional: "fldgp3AVHUikSwsDA",      // Software (O)
  hardSkillsOptional: "fldTcJYuh3dORr62t",    // Hard skills (O)
  softSkillsOptional: "fldVhNtmiKvlJsM1Y",    // Soft skills (O)
  certificatesOptional: "fldb8Efe2D4qxcynV",  // Certs (O)
  certificatesMandatory: "fld84RMIASvrWawxd", // Certs (M)
};
```

### Scoring Records Table (tbloo1HbPDSDBwofh)

```typescript
const SCORING_FIELDS = {
  name: "fldBvyEZzkHeZ1iYg",                    // Record name
  client: "fldrPJe7MtDNX3bUC",                  // Client
  jobOpenings: "fldb2IbOK2qC8l5hZ",            // Job (linked)
  finalOverallScore: "fldemv5V4GGJPadv1",      // Final score %
  recruiterScore: "fldbF1Jz7gXhph195",         // Recruiter %
  scoreOverview: "fldzENBH6lZWwWTDl",          // Score summary
  recruiterNotes: "fldEx8A15OQvkpkc0",         // Notes
  aiBasedNotes: "fldQA7jITSJ6vdM7L",           // AI notes
  aiRecommendation: "fld2GhnbBLYjV1ZJP",       // AI rec
  totalFlags: "fldM0uAnnZvjdnHKR",             // Missing count
  weightage: "fldWOrWrWNJPmeHx4",              // Weightage
  weightedScore: "fldl9uuwBAeqlCd7M",          // Weighted %
  scoreBasedJobDescription: "fldGSVYe3lPZxrwQa", // Module 1
  scoreBasedQuestions: "fldj8jD26QwAU68uQ",     // Module 2
  status: "fldUPlS2iHBIxzOKH",                 // Status
  applicants: "fldgIMQZeGmnZx8Rf",             // Applicant (linked)
  decision: "fld5kkyevAohZJbNG",               // Decision
  assignee: "fldRORbOnD7wi1JSD",               // Assigned to
  created: "fldNs7WewsXlkEKAB",                // Created date
};
```

---

## Notes

- **Null/Empty Handling:** Empty fields become `NULL` in PostgreSQL (not empty strings)
- **String Truncation:** Long values are truncated to column max length
- **Array Fields:** Single values or comma-separated text converted to arrays
- **Date Handling:** ISO8601 timestamps converted to PostgreSQL timestamp format
- **Numeric Conversion:** Text numbers parsed as integers or decimals
- **UUID Generation:** New records receive randomly generated UUIDs
- **Relationships:** Cross-table references resolved via migration state maps

---

**Last Updated:** February 2026
**Version:** 1.0
**Schema Version:** Drizzle ORM 0.45.1
