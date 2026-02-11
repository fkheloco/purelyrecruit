import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { candidateSkills, skills } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { id } = await params;

  const data = await db
    .select({
      id: candidateSkills.id,
      candidateId: candidateSkills.candidateId,
      skillId: candidateSkills.skillId,
      name: skills.name,
      proficiency: candidateSkills.proficiency,
      yearsExperience: candidateSkills.yearsExperience,
    })
    .from(candidateSkills)
    .innerJoin(skills, eq(candidateSkills.skillId, skills.id))
    .where(eq(candidateSkills.candidateId, id));

  return NextResponse.json({ data });
}
