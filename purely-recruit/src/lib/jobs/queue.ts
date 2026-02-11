import { db } from "@/db";
import { jobQueue } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";

export type JobType =
  | "score-application"
  | "parse-resume"
  | "enrich-candidate"
  | "match-talent-pool"
  | "send-notification"
  | "generate-analytics";

export async function enqueueJob(
  type: JobType,
  payload: Record<string, any>,
  delayMs: number = 0,
) {
  return db.insert(jobQueue).values({
    type,
    payload,
    nextRunAt: new Date(Date.now() + delayMs),
    status: "pending",
    maxRetries: 3,
  });
}

export async function claimPendingJobs(limit: number = 5) {
  const pending = await db
    .select()
    .from(jobQueue)
    .where(
      and(
        eq(jobQueue.status, "pending"),
        lt(jobQueue.nextRunAt, new Date()),
      ),
    )
    .limit(limit);

  for (const job of pending) {
    await db
      .update(jobQueue)
      .set({ status: "running", startedAt: new Date() })
      .where(eq(jobQueue.id, job.id));
  }

  return pending;
}

export async function completeJob(jobId: string) {
  await db
    .update(jobQueue)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(jobQueue.id, jobId));
}

export async function failJob(jobId: string, error: string, retries: number, maxRetries: number) {
  if (retries >= maxRetries) {
    await db
      .update(jobQueue)
      .set({ status: "failed", error })
      .where(eq(jobQueue.id, jobId));
  } else {
    const delayMs = Math.pow(2, retries) * 60000;
    await db
      .update(jobQueue)
      .set({
        status: "pending",
        retries: retries + 1,
        nextRunAt: new Date(Date.now() + delayMs),
        error,
      })
      .where(eq(jobQueue.id, jobId));
  }
}
