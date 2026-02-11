import {
  pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const userRoleEnum = pgEnum("user_role", [
  "platform_admin",
  "recruiter",
  "client_admin",
  "client_user",
  "candidate",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: userRoleEnum("role").default("candidate").notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  preferences: jsonb("preferences").default({}),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
