import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { candidateSkills } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { id } = await params;

  await db.delete(candidateSkills).where(eq(candidateSkills.id, id));

  return NextResponse.json({ success: true });
}
