import {
  pgTable, uuid, varchar, text, integer, timestamp,
  jsonb, boolean, pgEnum, real,
} from "drizzle-orm/pg-core";
import { users } from "./users";

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
  searchVector: text("search_vector"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
