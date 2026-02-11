import { pgTable, uuid, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const scoringConfigs = pgTable("scoring_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().unique()
    .references(() => tenants.id, { onDelete: "cascade" }),
  module1Weight: real("module_1_weight").default(0.40).notNull(),
  module2Weight: real("module_2_weight").default(0.30).notNull(),
  module3Weight: real("module_3_weight").default(0.30).notNull(),
  mandatorySkillPenalty: real("mandatory_skill_penalty").default(-10.0),
  goodIndicatorBonus: real("good_indicator_bonus").default(10.0),
  badIndicatorPenalty: real("bad_indicator_penalty").default(-10.0),
  customWeights: jsonb("custom_weights").default({}),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScoringConfig = typeof scoringConfigs.$inferSelect;
