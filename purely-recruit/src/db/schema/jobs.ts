import {
  pgTable, uuid, varchar, text, integer, timestamp, jsonb, pgEnum,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const jobStatusEnum = pgEnum("job_status", [
  "draft", "active", "paused", "closed", "filled",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time", "part_time", "contract", "temp", "intern",
]);

export const locationTypeEnum = pgEnum("location_type", [
  "onsite", "remote", "hybrid",
]);

export const jobOpenings = pgTable("job_openings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  department: varchar("department", { length: 255 }),
  locationCity: varchar("location_city", { length: 100 }),
  locationState: varchar("location_state", { length: 50 }),
  locationType: locationTypeEnum("location_type").default("onsite"),
  employmentType: employmentTypeEnum("employment_type").default("full_time"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description"),
  requirements: text("requirements"),
  goodIndicators: text("good_indicators").array(),
  badIndicators: text("bad_indicators").array(),
  status: jobStatusEnum("status").default("draft").notNull(),
  publishedBoards: text("published_boards").array(),
  externalIds: jsonb("external_ids").default({}),
  searchVector: text("search_vector"),
  createdBy: uuid("created_by").references(() => users.id),
  assignedRecruiter: uuid("assigned_recruiter").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closesAt: timestamp("closes_at"),
});

export type JobOpening = typeof jobOpenings.$inferSelect;
export type NewJobOpening = typeof jobOpenings.$inferInsert;
