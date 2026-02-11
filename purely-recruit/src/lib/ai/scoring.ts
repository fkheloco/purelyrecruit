import { anthropic, AI_MODEL } from "./client";
import { db } from "@/db";
import { applications, jobOpenings, candidates, resumes, scoringConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notify } from "@/lib/notifications/notify";

export async function scoreApplication(payload: { applicationId: string }) {
  const [app] = await db.select().from(applications).where(eq(applications.id, payload.applicationId)).limit(1);
  if (!app) return;

  await db.update(applications).set({ status: "ai_processing" }).where(eq(applications.id, app.id));

  const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, app.jobOpeningId)).limit(1);
  const [candidate] = await db.select().from(candidates).where(eq(candidates.id, app.candidateId)).limit(1);
  const [resume] = app.resumeId ? await db.select().from(resumes).where(eq(resumes.id, app.resumeId)).limit(1) : [null];
  const [config] = await db.select().from(scoringConfigs).where(eq(scoringConfigs.tenantId, app.tenantId)).limit(1);

  if (!job || !candidate) return;

  const weights = {
    module1: config?.module1Weight || 0.40,
    module2: config?.module2Weight || 0.30,
    module3: config?.module3Weight || 0.30,
  };

  const resumeText = resume?.rawText || resume?.parsedData ? JSON.stringify(resume.parsedData) : candidate.bio || "";
  const jobDescription = `${job.title}\n${job.description || ""}\n${job.requirements || ""}`;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `You are an AI recruiting scorer. Score this candidate for this job. Return ONLY valid JSON.

JOB POSTING:
Title: ${job.title}
Description: ${job.description || "N/A"}
Requirements: ${job.requirements || "N/A"}
Good Indicators: ${(job.goodIndicators || []).join(", ") || "N/A"}
Bad Indicators: ${(job.badIndicators || []).join(", ") || "N/A"}

CANDIDATE:
Name: ${candidate.firstName} ${candidate.lastName}
Title: ${candidate.currentTitle || "N/A"}
Company: ${candidate.currentCompany || "N/A"}
Experience: ${candidate.yearsExperience || "N/A"} years
Resume: ${resumeText.slice(0, 4000)}

SCORING MODULES:
Module 1 (${Math.round(weights.module1 * 100)}%): Resume vs Job Description match (0-100)
Module 2 (${Math.round(weights.module2 * 100)}%): Good/Bad Indicator check (0-100, boost for good indicators, penalty for bad)
Module 3 (${Math.round(weights.module3 * 100)}%): M/R/O skill evaluation (0-100, heavy penalty for missing mandatory skills)

Return:
{
  "module1Score": number,
  "module1Notes": "brief explanation",
  "module2Score": number,
  "module2Notes": "brief explanation",
  "goodIndicatorsFound": ["list"],
  "badIndicatorsFound": ["list"],
  "module3Score": number,
  "module3Notes": "brief explanation",
  "missingMandatoryCount": number,
  "missingMandatoryDetails": "list of missing mandatory skills",
  "recommendation": "strong_yes | yes | maybe | no | strong_no",
  "alternativePosition": "suggested better-fit role or null",
  "summary": "2-3 sentence overall assessment"
}`
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const scores = JSON.parse(text);
    
    const finalScore = (scores.module1Score * weights.module1) +
      (scores.module2Score * weights.module2) +
      (scores.module3Score * weights.module3);

    await db.update(applications).set({
      status: "scored",
      scoreModule1: scores.module1Score,
      scoreModule2: scores.module2Score,
      scoreModule3: scores.module3Score,
      finalScore: Math.round(finalScore * 100) / 100,
      weightedScore: Math.round(finalScore * 100) / 100,
      missingMandatoryCount: scores.missingMandatoryCount || 0,
      missingMandatoryDetails: scores.missingMandatoryDetails,
      aiRecommendation: scores.recommendation,
      aiNotes: scores.summary,
      aiAltPosition: scores.alternativePosition,
      aiFullReport: text,
      aiProcessedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(applications.id, app.id));

    if (job.assignedRecruiter) {
      await notify({
        userId: job.assignedRecruiter,
        tenantId: app.tenantId,
        type: "application_scored",
        title: `Application scored: ${candidate.firstName} ${candidate.lastName}`,
        body: `Score: ${Math.round(finalScore)}/100 — ${scores.recommendation}`,
        referenceType: "application",
        referenceId: app.id,
      });
    }
  } catch (e) {
    console.error("Failed to parse scoring response:", e);
    await db.update(applications).set({
      status: "new",
      aiNotes: "Scoring failed - will retry",
      updatedAt: new Date(),
    }).where(eq(applications.id, app.id));
  }
}
