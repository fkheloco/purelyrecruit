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
