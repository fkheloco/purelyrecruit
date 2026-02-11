import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { jobOpenings } from "./jobs";

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
