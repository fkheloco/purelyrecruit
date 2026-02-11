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
