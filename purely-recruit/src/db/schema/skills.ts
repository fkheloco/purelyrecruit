import {
  pgTable, uuid, varchar, text, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

export const skillCategoryEnum = pgEnum("skill_category", [
  "software", "hard_skill", "soft_skill", "certificate",
]);

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: skillCategoryEnum("category").notNull(),
  subcategory: varchar("subcategory", { length: 255 }),
  aliases: text("aliases").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
