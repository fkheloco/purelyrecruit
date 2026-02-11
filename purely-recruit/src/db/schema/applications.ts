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
  scoreModule1: real("score_module_1"),
  scoreModule2: real("score_module_2"),
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
  recruiterScore: real("recruiter_score"),
  recruiterNotes: text("recruiter_notes"),
  recruiterDecision: varchar("recruiter_decision", { length: 100 }),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  clientRating: integer("client_rating"),
  clientFeedback: text("client_feedback"),
  clientDecision: varchar("client_decision", { length: 100 }),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
