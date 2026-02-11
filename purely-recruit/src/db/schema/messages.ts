import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";
import { candidates } from "./candidates";
import { applications } from "./applications";

export const messageChannelEnum = pgEnum("message_channel", [
  "in_app", "email", "sms",
]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id"),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  recipientId: uuid("recipient_id").references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  candidateId: uuid("candidate_id").references(() => candidates.id),
  applicationId: uuid("application_id").references(() => applications.id),
  subject: varchar("subject", { length: 500 }),
  body: text("body").notNull(),
  sentOnBehalfOf: varchar("sent_on_behalf_of", { length: 50 }),
  channel: messageChannelEnum("channel").default("in_app"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
