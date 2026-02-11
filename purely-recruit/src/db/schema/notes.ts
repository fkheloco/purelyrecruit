import { pgTable, uuid, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { applications } from "./applications";
import { tenants } from "./tenants";
import { users } from "./users";

export const noteVisibilityEnum = pgEnum("note_visibility", [
  "internal", "client", "candidate",
]);

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id").references(() => candidates.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  authorId: uuid("author_id").notNull().references(() => users.id),
  authorRole: varchar("author_role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  visibility: noteVisibilityEnum("visibility").default("internal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
