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
