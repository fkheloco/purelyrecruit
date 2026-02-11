import {
  pgTable, uuid, varchar, text, timestamp, jsonb, boolean,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrgId: varchar("clerk_org_id").unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#455E7F"),
  accentColor: varchar("accent_color", { length: 7 }).default("#D7A839"),
  customDomain: varchar("custom_domain", { length: 255 }).unique(),
  website: text("website"),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  notificationDefaults: jsonb("notification_defaults").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
