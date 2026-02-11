import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { candidateSkills, skills } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const body = await req.json();

  // Find or create skill
  let [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.name, body.name.toLowerCase()))
    .limit(1);

  if (!skill) {
    const [newSkill] = await db
      .insert(skills)
      .values({
        name: body.name.toLowerCase(),
        category: body.category || "technical",
      })
      .returning();
    skill = newSkill;
  }

  // Add skill to candidate
  const [candidateSkill] = await db
    .insert(candidateSkills)
    .values({
      candidateId: body.candidateId,
      skillId: skill.id,
      proficiency: body.proficiency || "intermediate",
      yearsExperience: body.yearsExperience,
      source: "manual",
    })
    .returning();

  return NextResponse.json(
    { data: { ...candidateSkill, name: skill.name } },
    { status: 201 }
  );
}
