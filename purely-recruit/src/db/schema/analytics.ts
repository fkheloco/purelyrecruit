import { pgTable, uuid, varchar, date, jsonb, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const reportingSnapshots = pgTable("reporting_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  periodType: varchar("period_type", { length: 20 }).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  metrics: jsonb("metrics").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
