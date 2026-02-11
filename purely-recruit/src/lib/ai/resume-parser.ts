import { anthropic, AI_MODEL } from "./client";
import { db } from "@/db";
import { resumes, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function parseResume(payload: { resumeId: string; candidateId: string }) {
  const [resume] = await db.select().from(resumes).where(eq(resumes.id, payload.resumeId)).limit(1);
  if (!resume || !resume.rawText) return;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `Parse this resume into structured JSON. Return ONLY valid JSON, no markdown.

Resume text:
${resume.rawText}

Return this exact structure:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "currentTitle": "string",
  "currentCompany": "string",
  "locationCity": "string",
  "locationState": "string",
  "yearsExperience": number,
  "linkedinUrl": "string or null",
  "bio": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [{"company": "string", "title": "string", "startDate": "string", "endDate": "string or null", "description": "string"}],
  "education": [{"institution": "string", "degree": "string", "field": "string", "year": "string"}],
  "certifications": ["cert1", "cert2"]
}`
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  
  try {
    const parsed = JSON.parse(text);
    
    await db.update(resumes).set({
      parsedData: parsed,
      parsedSkills: parsed.skills || [],
      parsedExperience: parsed.experience || [],
      parsedEducation: parsed.education || [],
      parsedCertifications: parsed.certifications || [],
    }).where(eq(resumes.id, payload.resumeId));

    await db.update(candidates).set({
      firstName: parsed.firstName || undefined,
      lastName: parsed.lastName || undefined,
      currentTitle: parsed.currentTitle || undefined,
      currentCompany: parsed.currentCompany || undefined,
      locationCity: parsed.locationCity || undefined,
      locationState: parsed.locationState || undefined,
      yearsExperience: parsed.yearsExperience || undefined,
      linkedinUrl: parsed.linkedinUrl || undefined,
      bio: parsed.bio || undefined,
      updatedAt: new Date(),
    }).where(eq(candidates.id, payload.candidateId));
  } catch (e) {
    console.error("Failed to parse resume AI response:", e);
  }
}
