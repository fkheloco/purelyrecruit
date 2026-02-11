import { NextRequest, NextResponse } from "next/server";
import { claimPendingJobs, completeJob, failJob } from "@/lib/jobs/queue";
import { scoreApplication } from "@/lib/ai/scoring";
import { parseResume } from "@/lib/ai/resume-parser";
import { matchTalentPool } from "@/lib/ai/matching";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await claimPendingJobs(5);
  const results = { processed: 0, failed: 0 };

  for (const job of jobs) {
    try {
      switch (job.type) {
        case "score-application":
          await scoreApplication(job.payload as any);
          break;
        case "parse-resume":
          await parseResume(job.payload as any);
          break;
        case "match-talent-pool":
          await matchTalentPool(job.payload as any);
          break;
        case "send-notification":
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
      await completeJob(job.id);
      results.processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await failJob(job.id, message, job.retries || 0, job.maxRetries || 3);
      results.failed++;
    }
  }

  return NextResponse.json(results);
}
