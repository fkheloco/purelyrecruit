/**
 * Standalone Airtable to Neon Migration Script (No Dependencies)
 *
 * This script can run independently without requiring the full Next.js build.
 * It uses raw fetch() for Airtable API and @neondatabase/serverless for database access.
 *
 * Usage: npx tsx scripts/migrate-from-airtable-standalone.ts
 *
 * Environment variables required:
 * - AIRTABLE_API_KEY: Airtable Personal Access Token
 * - DATABASE_URL: Neon PostgreSQL connection string
 */

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const uuidv4 = randomUUID;

// Environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = "appjRIYMHpzycxDRU";
const DATABASE_URL = process.env.DATABASE_URL;

// Airtable table IDs
const TABLES = {
  APPLICANTS: "tblaexcKyvhg3CfUl",
  JOB_OPENINGS: "tbl4XxZEp8g1EZx25",
  SCORING_RECORDS: "tbloo1HbPDSDBwofh",
  SOFT_SKILLS: "tbl5ROVTv7rNr3w3n",
  HARD_SKILLS: "tblA1BS6VNBX0THhZ",
  SOFTWARE: "tblKyguCWCvgvcQkt",
  CERTIFICATES: "tblAoEIfrIIHWXdVT",
};

// Field IDs for Applicants
const APPLICANT_FIELDS = {
  title: "fldXynNAuGBnpjMxI",
  firstName: "fldjcorLIc3xvdT1i",
  lastName: "fldpmGcZ6cx3jBHah",
  salary: "fldnhIoh1NeiSz4xj",
  phone: "flddEm0ozjLwaIFWU",
  professionalTitle: "fldkGYKII8a3mseGE",
  email: "fldpH2fOVpJyQ7RC9",
  linkedin: "fldGFaybrLfFuR7sV",
  role: "fldEivyvnzlJCqDto",
  languageSkills: "fldsVIDWxXhe1DzFY",
  eligibility: "fld5feYmmYhrBp3uP",
  recruitingSource: "fldvzpE3D6ftT0h7g",
  experienceYearStarted: "fldKhaihAEvm23HF2",
  hourlyRate: "fldlrKp5oAAhEz5CG",
  mailingAddress: "fldOBkyDfYOS4dHUD",
  workFormatPreference: "fldoR0vbTdIm1PRSq",
  willRelocate: "fldRyVQI2raat9Uda",
  college: "fldrJc8ohCu09borc",
  softwares: "fldiNOZZbGY5Sl6NS",
  certifications: "fld1focmnqkiCmpt5",
  hardSkills: "fld0yor7lOYCAF1XM",
  softSkills: "fldN2moWS35UeTSSK",
  status: "fldnOuv0qDLaHioPI",
  fullTextResume: "fldfticZ1kap7H3Yp",
  resume: "fld4gSebzps6cEo9h",
  totalExperience: "fldA7Qc1IBIrZTz6o",
  created: "fldboG2wS2VGHOCcd",
  recordId: "fld44TJEjhTBR2yAF",
};

// Field IDs for Job Openings
const JOB_OPENING_FIELDS = {
  title: "fldoSLW6u6OOpVRHo",
  account: "fldGMPdadBfpNaQ4D",
  titleForResume: "fld3AWV69aH2NX3zl",
  hiringManagerOrGroup: "fldfoWOKiguIv6NHJ",
  experienceRange: "fldKfdEG5xUn7oFTe",
  candidateRate: "fldUvjqdR6GUXYSVB",
  locationStreet: "fldW6GhFMpqjVr1Zd",
  locationCity: "fldlQod6umZFyoPf2",
  locationState: "fldLoTWdwEBDE9v5M",
  locationCountry: "fldmTb1FPxtNhSRgR",
  locationPostal: "fldlK0WNsL8lvwv0b",
  resumeRfpDueDate: "fldyK6U8GNSfoNKF3",
  onsiteHybridRemote: "fldz0xBNWrtiTLkaj",
  educationLevel: "fldJb4HYwZ7ZzRPqC",
  contractTermMonths: "fld80sYkgPBrO4H4k",
  stage: "fldenelJIWAjQgQuz",
  jobDescription: "fldq8uWjx7GTod8DW",
  goodThingsToLookFor: "fldnO5L9VVnQcdoZ4",
  badThingsToWatchOut: "fldr8gQPxI8Gxr4eP",
  psTeamNotes: "fldDCGnWeQi1zf1Z0",
  created: "fldlIb1f2D8fcuFJq",
  clientName: "fldtRiwnIOVV96Zv3",
  jobIdForReference: "fldKuUvDAeEiEP6kg",
  softwareMandatory: "fldtTRyEm8toilEb8",
  hardSkillsMandatory: "fld8Vu2DC5BWZ5O4g",
  softSkillsMandatory: "fldVJHeIDJ0PCJnzj",
  softwareRequired: "fld231zIH2ErAWc9G",
  hardSkillsRequired: "fldY4MrgkQSBxJ9im",
  softSkillsRequired: "fldqGDVJSFon1OGSe",
  certificatesRequired: "fldiwyKZ7tkeU5fHt",
  softwareOptional: "fldgp3AVHUikSwsDA",
  hardSkillsOptional: "fldTcJYuh3dORr62t",
  softSkillsOptional: "fldVhNtmiKvlJsM1Y",
  certificatesOptional: "fldb8Efe2D4qxcynV",
  certificatesMandatory: "fld84RMIASvrWawxd",
};

// Field IDs for Scoring Records
const SCORING_FIELDS = {
  name: "fldBvyEZzkHeZ1iYg",
  client: "fldrPJe7MtDNX3bUC",
  jobOpenings: "fldb2IbOK2qC8l5hZ",
  finalOverallScore: "fldemv5V4GGJPadv1",
  recruiterScore: "fldbF1Jz7gXhph195",
  scoreOverview: "fldzENBH6lZWwWTDl",
  recruiterNotes: "fldEx8A15OQvkpkc0",
  aiBasedNotes: "fldQA7jITSJ6vdM7L",
  aiRecommendation: "fld2GhnbBLYjV1ZJP",
  totalFlags: "fldM0uAnnZvjdnHKR",
  weightage: "fldWOrWrWNJPmeHx4",
  weightedScore: "fldl9uuwBAeqlCd7M",
  scoreBasedJobDescription: "fldGSVYe3lPZxrwQa",
  scoreBasedQuestions: "fldj8jD26QwAU68uQ",
  status: "fldUPlS2iHBIxzOKH",
  applicants: "fldgIMQZeGmnZx8Rf",
  decision: "fld5kkyevAohZJbNG",
  assignee: "fldRORbOnD7wi1JSD",
  created: "fldNs7WewsXlkEKAB",
};

// Type definitions
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Migration state
const migrationState = {
  skillMap: new Map<string, string>(),
  candidateMap: new Map<string, string>(),
  jobMap: new Map<string, string>(),
  tenantId: "",
  stats: {
    skillsCreated: 0,
    candidatesCreated: 0,
    resumesCreated: 0,
    candidateSkillsCreated: 0,
    jobsCreated: 0,
    jobSkillsCreated: 0,
    applicationsCreated: 0,
    errors: 0,
  },
};

// Logger utility
function log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: "[INFO]",
    success: "[SUCCESS]",
    error: "[ERROR]",
    warn: "[WARN]",
  }[type];

  console.log(`${timestamp} ${prefix} ${message}`);
}

// Validate environment
function validateEnvironment() {
  if (!AIRTABLE_API_KEY) {
    throw new Error("AIRTABLE_API_KEY environment variable is required");
  }
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  log("Environment validation passed");
}

// Fetch Airtable records
async function fetchAirtableRecords(
  tableId: string,
  fields?: string[]
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`
    );

    if (offset) {
      url.searchParams.set("offset", offset);
    }

    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        url.searchParams.append("fields[]", field);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Airtable API error: ${response.status} ${response.statusText}`
      );
    }

    const data: AirtableResponse = await response.json();
    records.push(...data.records);
    offset = data.offset;

    log(
      `Fetched ${data.records.length} records from ${tableId}, offset: ${offset || "none"}`
    );
  } while (offset);

  return records;
}

// Generate UUID
function generateId(): string {
  return uuidv4();
}

// Parse address
function parseAddress(address: string): { city?: string; state?: string } {
  if (!address) return {};
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return {
      city: parts[parts.length - 2],
      state: parts[parts.length - 1],
    };
  }
  return { city: address };
}

// Map availability
function mapAvailability(preference: string): string {
  const map: Record<string, string> = {
    immediate: "immediate",
    "2 weeks": "two_weeks",
    "1 month": "one_month",
    "3 months": "three_months",
    "not looking": "not_looking",
  };
  return map[preference?.toLowerCase()] || "not_looking";
}

// Calculate years experience
function calculateYearsExperience(yearStarted: number | string): number {
  if (!yearStarted) return 0;
  const year = typeof yearStarted === "string" ? parseInt(yearStarted, 10) : yearStarted;
  if (isNaN(year)) return 0;
  const currentYear = new Date().getFullYear();
  const years = currentYear - year;
  return Math.max(0, years);
}

// Map job status
function mapJobStatus(stage: string): string {
  const map: Record<string, string> = {
    active: "active",
    paused: "paused",
    closed: "closed",
    draft: "draft",
    filled: "filled",
    open: "active",
    pending: "draft",
  };
  return map[stage?.toLowerCase()] || "draft";
}

// Map location type
function mapLocationType(locationType: string): string {
  const normalized = locationType?.toLowerCase() || "onsite";
  if (normalized.includes("remote")) return "remote";
  if (normalized.includes("hybrid")) return "hybrid";
  return "onsite";
}

// Map application status
function mapApplicationStatus(status: string): string {
  const map: Record<string, string> = {
    new: "new",
    reviewed: "reviewed",
    shortlisted: "shortlisted",
    rejected: "rejected",
    offered: "offered",
    hired: "hired",
    submitted: "new",
    pending: "new",
  };
  return map[status?.toLowerCase()] || "new";
}

// Database operations
async function createDefaultTenant(sql: any): Promise<string> {
  try {
    const existing = await (sql as any).query(
      "SELECT id FROM tenants WHERE slug = 'purely-works' LIMIT 1"
    );

    if (existing && existing.length > 0) {
      log(`Using existing tenant: ${existing[0].id}`);
      return existing[0].id;
    }

    const tenantId = generateId();
    await (sql as any).query(
      `INSERT INTO tenants (
        id, clerk_org_id, name, slug, description, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        tenantId,
        "clerk-org-purely-works-migration",
        "Purely Works",
        "purely-works",
        "Default tenant for Airtable migration",
        true,
      ]
    );

    log(`Created default tenant: ${tenantId}`, "success");
    return tenantId;
  } catch (error) {
    log(`Error creating tenant: ${error instanceof Error ? error.message : String(error)}`, "error");
    throw error;
  }
}

// Migrate skills
async function migrateSkills(sql: any) {
  log("Starting skill taxonomy migration...");

  const skillRecords = {
    soft_skill: await fetchAirtableRecords(TABLES.SOFT_SKILLS, [
      "fld8EH1i7bICNMQ8c",
      "fldJmSrHPOC31nDDm",
    ]),
    hard_skill: await fetchAirtableRecords(TABLES.HARD_SKILLS, [
      "fldUa35uboWwHREey",
      "fldC9F8ZlY5s8LapL",
    ]),
    software: await fetchAirtableRecords(TABLES.SOFTWARE, [
      "fldIlsJezRMLo7iQW",
      "flduJOvR689U6RGpa",
    ]),
    certificate: await fetchAirtableRecords(TABLES.CERTIFICATES, [
      "fldGxg90qO1mmw25A",
      "fld8kFyr1HTgAnU23",
    ]),
  };

  for (const [category, records] of Object.entries(skillRecords)) {
    for (const record of records) {
      try {
        const skillName =
          record.fields["fld8EH1i7bICNMQ8c"] ||
          record.fields["fldUa35uboWwHREey"] ||
          record.fields["fldIlsJezRMLo7iQW"] ||
          record.fields["fldGxg90qO1mmw25A"];

        if (!skillName) {
          log(`Skipping skill record with no name: ${record.id}`, "warn");
          continue;
        }

        const subcategory =
          record.fields["fldC9F8ZlY5s8LapL"] ||
          record.fields["flduJOvR689U6RGpa"] ||
          record.fields["fld8kFyr1HTgAnU23"] ||
          undefined;

        const skillId = generateId();

        await (sql as any).query(
          `INSERT INTO skills (id, name, category, subcategory, is_active, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [skillId, skillName, category, subcategory, true]
        );

        migrationState.skillMap.set(record.id, skillId);
        migrationState.stats.skillsCreated++;
      } catch (error) {
        log(
          `Error migrating skill ${record.id}: ${error instanceof Error ? error.message : String(error)}`,
          "error"
        );
        migrationState.stats.errors++;
      }
    }
  }

  log(
    `Completed skill migration: ${migrationState.stats.skillsCreated} skills created`,
    "success"
  );
}

// Migrate candidates
async function migrateCandidates(sql: any) {
  log("Starting candidate migration...");

  const applicantFields = Object.values(APPLICANT_FIELDS);
  const applicants = await fetchAirtableRecords(TABLES.APPLICANTS, applicantFields);

  log(`Fetched ${applicants.length} applicants to migrate`);

  for (const applicant of applicants) {
    try {
      const fields = applicant.fields;

      const firstName = fields[APPLICANT_FIELDS.firstName] || "Unknown";
      const lastName = fields[APPLICANT_FIELDS.lastName] || "";
      const email =
        fields[APPLICANT_FIELDS.email] ||
        `unknown-${applicant.id}@purely-recruit.local`;
      const phone = fields[APPLICANT_FIELDS.phone];
      const linkedin = fields[APPLICANT_FIELDS.linkedin];
      const currentTitle = fields[APPLICANT_FIELDS.professionalTitle];
      const salary = fields[APPLICANT_FIELDS.salary];
      const experienceYearStarted = fields[APPLICANT_FIELDS.experienceYearStarted];
      const totalExperience = fields[APPLICANT_FIELDS.totalExperience];
      const mailingAddress = fields[APPLICANT_FIELDS.mailingAddress];
      const workFormat = fields[APPLICANT_FIELDS.workFormatPreference];
      const fullTextResume = fields[APPLICANT_FIELDS.fullTextResume];
      const recruitingSource = fields[APPLICANT_FIELDS.recruitingSource];

      const { city, state } = parseAddress(mailingAddress);

      const candidateId = generateId();

      await (sql as any).query(
        `INSERT INTO candidates (
          id, email, first_name, last_name, phone, linkedin_url, current_title,
          location_city, location_state, location_country, years_experience,
          salary_expectation_min, salary_expectation_max, availability, source,
          is_profile_public, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          candidateId,
          email,
          firstName,
          lastName,
          phone,
          linkedin,
          currentTitle,
          city,
          state,
          "US",
          totalExperience || calculateYearsExperience(experienceYearStarted),
          salary ? Math.round(salary * 0.9) : null,
          salary || null,
          mapAvailability(workFormat),
          recruitingSource || "airtable_migration",
          true,
          new Date(applicant.createdTime),
          new Date(applicant.createdTime),
        ]
      );

      migrationState.candidateMap.set(applicant.id, candidateId);
      migrationState.stats.candidatesCreated++;

      // Create resume
      if (fullTextResume) {
        const resumeId = generateId();
        await (sql as any).query(
          `INSERT INTO resumes (
            id, candidate_id, file_url, file_name, file_type, raw_text, is_primary, uploaded_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            resumeId,
            candidateId,
            `data:text/plain;base64,${Buffer.from(fullTextResume).toString("base64")}`,
            `${firstName}-${lastName}-resume.txt`,
            "text/plain",
            fullTextResume,
            true,
          ]
        );

        migrationState.stats.resumesCreated++;
      }

      // Link skills
      const allSkillIds = [
        ...(fields[APPLICANT_FIELDS.softSkills] || []),
        ...(fields[APPLICANT_FIELDS.hardSkills] || []),
        ...(fields[APPLICANT_FIELDS.softwares] || []),
        ...(fields[APPLICANT_FIELDS.certifications] || []),
      ];

      for (const skillId of allSkillIds) {
        const uuidSkillId = migrationState.skillMap.get(skillId);
        if (uuidSkillId) {
          try {
            const skillLinkId = generateId();
            await (sql as any).query(
              `INSERT INTO candidate_skills (
                id, candidate_id, skill_id, proficiency, source
              ) VALUES ($1, $2, $3, $4, $5)`,
              [skillLinkId, candidateId, uuidSkillId, "intermediate", "airtable_migration"]
            );

            migrationState.stats.candidateSkillsCreated++;
          } catch (error) {
            log(
              `Error linking skill ${skillId} to candidate ${candidateId}: ${error instanceof Error ? error.message : String(error)}`,
              "warn"
            );
          }
        }
      }
    } catch (error) {
      log(
        `Error migrating applicant ${applicant.id}: ${error instanceof Error ? error.message : String(error)}`,
        "error"
      );
      migrationState.stats.errors++;
    }
  }

  log(
    `Completed candidate migration: ${migrationState.stats.candidatesCreated} candidates, ${migrationState.stats.resumesCreated} resumes, ${migrationState.stats.candidateSkillsCreated} skill links`,
    "success"
  );
}

// Migrate job openings
async function migrateJobOpenings(sql: any) {
  log("Starting job opening migration...");

  const jobFields = Object.values(JOB_OPENING_FIELDS);
  const jobOpeningsRecords = await fetchAirtableRecords(TABLES.JOB_OPENINGS, jobFields);

  log(`Fetched ${jobOpeningsRecords.length} job openings to migrate`);

  for (const job of jobOpeningsRecords) {
    try {
      const fields = job.fields;

      const title = fields[JOB_OPENING_FIELDS.title] || "Untitled Position";
      const description = fields[JOB_OPENING_FIELDS.jobDescription];
      const requirements = fields[JOB_OPENING_FIELDS.goodThingsToLookFor];
      const goodIndicators = fields[JOB_OPENING_FIELDS.goodThingsToLookFor]
        ? [fields[JOB_OPENING_FIELDS.goodThingsToLookFor]]
        : [];
      const badIndicators = fields[JOB_OPENING_FIELDS.badThingsToWatchOut]
        ? [fields[JOB_OPENING_FIELDS.badThingsToWatchOut]]
        : [];

      const locationCity = fields[JOB_OPENING_FIELDS.locationCity];
      const locationState = fields[JOB_OPENING_FIELDS.locationState];
      const locationType = fields[JOB_OPENING_FIELDS.onsiteHybridRemote];
      const stage = fields[JOB_OPENING_FIELDS.stage];
      const salaryMin = fields[JOB_OPENING_FIELDS.candidateRate];

      const jobId = generateId();

      await (sql as any).query(
        `INSERT INTO job_openings (
          id, tenant_id, title, description, requirements,
          good_indicators, bad_indicators, location_city, location_state,
          location_type, status, salary_min, salary_max, employment_type,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          jobId,
          migrationState.tenantId,
          title,
          description,
          requirements,
          JSON.stringify(goodIndicators),
          JSON.stringify(badIndicators),
          locationCity,
          locationState,
          mapLocationType(locationType),
          mapJobStatus(stage),
          salaryMin ? Math.round(salaryMin * 1000) : null,
          null,
          "contract",
          new Date(job.createdTime),
          new Date(job.createdTime),
        ]
      );

      migrationState.jobMap.set(job.id, jobId);
      migrationState.stats.jobsCreated++;

      // Link skills
      const skillMapping = [
        [JOB_OPENING_FIELDS.softwareMandatory, "mandatory"],
        [JOB_OPENING_FIELDS.hardSkillsMandatory, "mandatory"],
        [JOB_OPENING_FIELDS.softSkillsMandatory, "mandatory"],
        [JOB_OPENING_FIELDS.certificatesMandatory, "mandatory"],
        [JOB_OPENING_FIELDS.softwareRequired, "required"],
        [JOB_OPENING_FIELDS.hardSkillsRequired, "required"],
        [JOB_OPENING_FIELDS.softSkillsRequired, "required"],
        [JOB_OPENING_FIELDS.certificatesRequired, "required"],
        [JOB_OPENING_FIELDS.softwareOptional, "optional"],
        [JOB_OPENING_FIELDS.hardSkillsOptional, "optional"],
        [JOB_OPENING_FIELDS.softSkillsOptional, "optional"],
        [JOB_OPENING_FIELDS.certificatesOptional, "optional"],
      ];

      for (const [fieldKey, importance] of skillMapping) {
        const skillIds = fields[fieldKey as keyof typeof JOB_OPENING_FIELDS] || [];

        for (const skillId of skillIds) {
          const uuidSkillId = migrationState.skillMap.get(skillId);
          if (uuidSkillId) {
            try {
              const jobSkillId = generateId();
              await (sql as any).query(
                `INSERT INTO job_skill_requirements (
                  id, job_opening_id, skill_id, importance
                ) VALUES ($1, $2, $3, $4)`,
                [jobSkillId, jobId, uuidSkillId, importance]
              );

              migrationState.stats.jobSkillsCreated++;
            } catch (error) {
              log(
                `Error linking skill ${skillId} to job ${jobId}: ${error instanceof Error ? error.message : String(error)}`,
                "warn"
              );
            }
          }
        }
      }
    } catch (error) {
      log(
        `Error migrating job opening ${job.id}: ${error instanceof Error ? error.message : String(error)}`,
        "error"
      );
      migrationState.stats.errors++;
    }
  }

  log(
    `Completed job opening migration: ${migrationState.stats.jobsCreated} jobs, ${migrationState.stats.jobSkillsCreated} skill requirements`,
    "success"
  );
}

// Migrate scoring records
async function migrateScoringRecords(sql: any) {
  log("Starting scoring records migration...");

  const scoringFields = Object.values(SCORING_FIELDS);
  const scoringRecords = await fetchAirtableRecords(TABLES.SCORING_RECORDS, scoringFields);

  log(`Fetched ${scoringRecords.length} scoring records to migrate`);

  for (const scoring of scoringRecords) {
    try {
      const fields = scoring.fields;

      const applicantIds = fields[SCORING_FIELDS.applicants] || [];
      const jobIds = fields[SCORING_FIELDS.jobOpenings] || [];

      if (applicantIds.length === 0 || jobIds.length === 0) {
        log(
          `Skipping scoring record ${scoring.id}: missing applicant or job reference`,
          "warn"
        );
        continue;
      }

      const candidateId = migrationState.candidateMap.get(applicantIds[0]);
      const jobId = migrationState.jobMap.get(jobIds[0]);

      if (!candidateId || !jobId) {
        log(
          `Skipping scoring record ${scoring.id}: candidate or job not found in migration map`,
          "warn"
        );
        continue;
      }

      const finalScore = fields[SCORING_FIELDS.finalOverallScore];
      const weightedScore = fields[SCORING_FIELDS.weightedScore];
      const scoreModule1 = fields[SCORING_FIELDS.scoreBasedJobDescription];
      const scoreModule2 = fields[SCORING_FIELDS.scoreBasedQuestions];
      const recruiterScore = fields[SCORING_FIELDS.recruiterScore];
      const status = fields[SCORING_FIELDS.status];
      const decision = fields[SCORING_FIELDS.decision];
      const aiNotes = fields[SCORING_FIELDS.aiBasedNotes];
      const aiRecommendation = fields[SCORING_FIELDS.aiRecommendation];
      const recruiterNotes = fields[SCORING_FIELDS.recruiterNotes];
      const missingFlags = fields[SCORING_FIELDS.totalFlags] || 0;

      const appId = generateId();

      await (sql as any).query(
        `INSERT INTO applications (
          id, candidate_id, job_opening_id, tenant_id, status, source,
          final_score, weighted_score, score_module_1, score_module_2,
          recruiter_score, ai_notes, ai_recommendation, recruiter_notes,
          recruiter_decision, missing_mandatory_count, applied_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          appId,
          candidateId,
          jobId,
          migrationState.tenantId,
          mapApplicationStatus(status),
          "airtable_migration",
          finalScore ? parseFloat(finalScore) : null,
          weightedScore ? parseFloat(weightedScore) : null,
          scoreModule1 ? parseFloat(scoreModule1) : null,
          scoreModule2 ? parseFloat(scoreModule2) : null,
          recruiterScore ? parseFloat(recruiterScore) : null,
          aiNotes,
          aiRecommendation,
          recruiterNotes,
          decision,
          missingFlags,
          new Date(scoring.createdTime),
          new Date(scoring.createdTime),
        ]
      );

      migrationState.stats.applicationsCreated++;
    } catch (error) {
      log(
        `Error migrating scoring record ${scoring.id}: ${error instanceof Error ? error.message : String(error)}`,
        "error"
      );
      migrationState.stats.errors++;
    }
  }

  log(
    `Completed scoring records migration: ${migrationState.stats.applicationsCreated} applications`,
    "success"
  );
}

// Generate summary
function generateSummaryReport() {
  const report = `
================================================================================
                    AIRTABLE MIGRATION SUMMARY REPORT
================================================================================

Migration completed at: ${new Date().toISOString()}

Statistics:
-----------
Skills Created:                ${migrationState.stats.skillsCreated}
Candidates Created:            ${migrationState.stats.candidatesCreated}
Resumes Created:               ${migrationState.stats.resumesCreated}
Candidate Skills Created:      ${migrationState.stats.candidateSkillsCreated}
Job Openings Created:          ${migrationState.stats.jobsCreated}
Job Skill Requirements:        ${migrationState.stats.jobSkillsCreated}
Applications Created:          ${migrationState.stats.applicationsCreated}
Migration Errors:              ${migrationState.stats.errors}

Tenant Information:
-------------------
Tenant ID:                     ${migrationState.tenantId}
Tenant Name:                   Purely Works

Source Information:
-------------------
Airtable Base ID:              ${AIRTABLE_BASE_ID}
Migration Timestamp:           ${new Date().toISOString()}

================================================================================
`;

  return report;
}

// Main migration function
async function runMigration() {
  try {
    log("=== Starting Standalone Airtable to Neon Migration ===");
    validateEnvironment();

    const sql = neon(DATABASE_URL!);

    // Create tenant
    migrationState.tenantId = await createDefaultTenant(sql);

    // Migrate skills
    await migrateSkills(sql);

    // Migrate candidates
    await migrateCandidates(sql);

    // Migrate jobs
    await migrateJobOpenings(sql);

    // Migrate scoring records
    await migrateScoringRecords(sql);

    // Display summary
    const summary = generateSummaryReport();
    console.log(summary);

    log("=== Migration Complete ===", "success");
    process.exit(0);
  } catch (error) {
    log(
      `Fatal error during migration: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
    console.error(error);
    process.exit(1);
  }
}

// Run migration
runMigration();
