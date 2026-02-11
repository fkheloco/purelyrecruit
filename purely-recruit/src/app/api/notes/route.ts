import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes, Note } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");
  const candidateId = searchParams.get("candidateId");

  let data: Note[];
  if (applicationId) {
    data = await db.select().from(notes).where(eq(notes.applicationId, applicationId)).orderBy(desc(notes.createdAt));
  } else if (candidateId) {
    data = await db.select().from(notes).where(eq(notes.candidateId, candidateId)).orderBy(desc(notes.createdAt));
  } else {
    data = [];
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const body = await req.json();
  
  const [note] = await db.insert(notes).values({
    candidateId: body.candidateId,
    applicationId: body.applicationId,
    tenantId: context.tenantId,
    authorId: context.userId,
    authorRole: context.role,
    content: body.content,
    visibility: body.visibility || "internal",
  }).returning();

  return NextResponse.json({ data: note }, { status: 201 });
}
