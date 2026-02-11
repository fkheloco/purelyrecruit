import {
  pgTable, uuid, varchar, text, integer, timestamp, jsonb, pgEnum,
} from "drizzle-orm/pg-core";

export const jobQueueStatusEnum = pgEnum("job_queue_status", [
  "pending", "running", "completed", "failed",
]);

export const jobQueue = pgTable("job_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: jsonb("payload").default({}),
  status: jobQueueStatusEnum("status").default("pending").notNull(),
  retries: integer("retries").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRunAt: timestamp("next_run_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type JobQueueItem = typeof jobQueue.$inferSelect;
export type NewJobQueueItem = typeof jobQueue.$inferInsert;
